import { defineEndpoint } from '@directus/extensions-sdk';
import { getKnexInstance } from './utils';
import { SQLPanelFields } from '../interface-sql-panel/type';

export default defineEndpoint({
  id: 'endpoints-sql-panel',
  handler: async (router) => {
    router.post('/:fieldId', async (req, res) => {
      const PARAM_NAME = '$entityId';
      const knex = getKnexInstance();
      try {
        /**
         * Add BigInt support to JSON.stringify cf: https://github.com/GoogleChromeLabs/jsbi/issues/30
         */
        (BigInt.prototype as any).toJSON = function () {
          return this.toString();
        };

        const { fieldId } = req.params as { fieldId: string };
        if (!fieldId) res.status(400).send('Missing fieldId');
        const field = await knex('directus_fields')
          .where({ id: fieldId })
          .first();
        if (!field) res.status(404).send(`Field ${fieldId} not found`);
        const { sql, is_using_entity_id } = field.options as SQLPanelFields;
        if (!sql) res.status(404).send(`Field ${fieldId} has no sql option`);
        if (is_using_entity_id) {
          const { entityId } = req.body as { entityId: string };

          if (!entityId) res.status(400).send('Missing entityId');
          const preparedSql = sql.replace(PARAM_NAME, entityId);
          const result = await knex.raw(preparedSql);
          console.log(result);
          res.status(200).send(result);
        } else {
          const result = await knex.raw(sql);
          res.status(200).send(result);
        }
      } catch (e) {
        console.log(e);
        res.status(500).send('Error connecting to database');
      } finally {
        knex.destroy();
      }
    });
  },
});
