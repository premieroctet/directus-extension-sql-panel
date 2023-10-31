# SQL Panel - Directus extension

This is a custom interface for [Directus](https://directus.io/) that allows you to display result of your SQL queries in a table.

## Installation

```bash
npm install @premieroctet/directus-extension-sql-panel/directus-extension-sql-panel
```

or using yarn :

```bash
yarn add @premieroctet/directus-extension-sql-panel/directus-extension-sql-panel
```

You should be set to go, [Directus will automatically detect the extension](https://docs.directus.io/guides/extensions/operations-npm-package.html#add-operation-to-directus).

## Usage

How to use the extension in your Directus project ?

- Add a new **SQL Panel** field to a data model (or edit an existing one)
- Fill out the field settings with your SQL query and some other options (see below)
- Save the field settings
- Enjoy ! 🎉

## 🧪 Example of usage

Let's say you're building a back-office to manage movies / actors and credits.
You might want to display a list cast and crew of a movie in the movie's detail page.

![Example of usage](https://github.com/premieroctet/directus-extension-sql-panel/blob/main/docs/example.png)

To do so, you can create a new **SQL Panel** field in the `movies` data model, and fill out the settings with the following SQL query:

```sql
SELECT
persons.id,
persons.name,
role
FROM credits
LEFT JOIN persons ON person = persons.id
WHERE movie = $entityId;
```

Here we're using the `$entityId` variable to get the current movie's id. It's part of our API and is automatically replaced by the current entity's id.

We'll now fill out the columns settings. For each column, you can specify:

- The column's name
- The column's type ([text](#column-types), [date](#column-types), [date time](#column-types), [ressource id](#column-types), [list of options](#column-types))
- The column's width (in pixels) (optional)
- If it's sortable (optional)

![Example of settings top](https://github.com/premieroctet/directus-extension-sql-panel/blob/main/docs/example-settings-1.png)
![Example of settings bottom](https://github.com/premieroctet/directus-extension-sql-panel/blob/main/docs/example-settings-2.png)

We save the field settings and we're done ! 🎉

## 📚 Documentation

### Column types

We currently support the following column types:

##### Text

A simple text field, value is displayed as is.

##### Date

A date field, value is displayed as a date (format: `YYYY-MM-DD`).

##### Date time

A date time field, value is displayed as a date time (format: `YYYY-MM-DD at HH:mm PM/AM`).

##### Ressource ID

A ressource ID field, value is displayed as a link to the ressource's detail page. When the user clicks on the row, it will be redirected to the ressource's detail page.
You need to specify the ressource's name in the `ressource` field settings.
We recommend set the width of this column to `0` so it's not displayed and the row is still clickable.

**⚠️ You can only use this type once per query as it will make the entiere row clickable.**

##### List of options

![List of options settings](https://github.com/premieroctet/directus-extension-sql-panel/blob/main/docs/list-settings.png)

A list of options to be displayed according to the value.
You need to specify the list of options in the `list of options` field settings.
For each option, you need to specify:

- The option's value
- The option's label
  and optionally:
- The option's color (hexadecimal value)

![Option settings](https://github.com/premieroctet/directus-extension-sql-panel/blob/main/docs/option-settings.png)
