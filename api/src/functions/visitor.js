const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);

const database = client.database(
  process.env.COSMOS_DATABASE || 'PortfolioDB'
);

const container = database.container(
  process.env.COSMOS_CONTAINER || 'Visitors'
);

async function getCurrentCount() {
  try {
    const { resource } = await container.item('site', 'site').read();
    return resource?.count ?? 0;
  } catch (error) {
    if (error.code === 404) {
      return 0;
    }

    throw error;
  }
}

async function incrementCount() {
  try {
    const { resource } = await container
      .item('site', 'site')
      .patch([
        {
          op: 'incr',
          path: '/count',
          value: 1
        }
      ]);

    return resource.count;
  } catch (error) {
    if (error.code !== 404) {
      throw error;
    }

    try {
      const { resource } = await container.items.create({
        id: 'site',
        count: 1
      });

      return resource.count;
    } catch (createError) {
      if (createError.code !== 409) {
        throw createError;
      }

      const { resource } = await container
        .item('site', 'site')
        .patch([
          {
            op: 'incr',
            path: '/count',
            value: 1
          }
        ]);

      return resource.count;
    }
  }
}

app.http('visitor', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'visitor',

  handler: async (request, context) => {
    try {
      const count =
        request.method === 'POST'
          ? await incrementCount()
          : await getCurrentCount();

      return {
        status: 200,
        headers: {
          'Cache-Control': 'no-store'
        },
        jsonBody: {
          count
        }
      };
    } catch (error) {
      context.error('Visitor counter failed:', error);

      return {
        status: 500,
        jsonBody: {
          error: 'Unable to retrieve visitor count.'
        }
      };
    }
  }
});
