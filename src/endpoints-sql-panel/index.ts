import { defineEndpoint } from '@directus/extensions-sdk';
import { ClientSafeError, executeRawSQL, getFieldData } from './utils';

export default defineEndpoint({
  id: 'endpoints-sql-panel',
  handler: async (router, context) => {
    router.post<{ fieldId: string }>('/:fieldId', async (req, res) => {
      const knex = context.database;
      /**
       * Add BigInt support to JSON.stringify cf: https://github.com/GoogleChromeLabs/jsbi/issues/30
       */
      (BigInt.prototype as any).toJSON = function () {
        return this.toString();
      };
      const { fieldId } = req.params;

      try {
        const { sql, is_using_entity_id } = await getFieldData(knex, fieldId);

        const currentEntityId = req.body.entityId;
        const result = await executeRawSQL(knex, sql, {
          isUsingEntityId: is_using_entity_id,
          currentEntityId,
        });
        res.status(200).send(result);
      } catch (e) {
        console.error(e);
        if ((e as ClientSafeError).isClientSafe) {
          res.status(400).send((e as ClientSafeError).message);
        } else {
          res.status(500).send('Error connecting to database');
        }
      }
    });
  },
});
