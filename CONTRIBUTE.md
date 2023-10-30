To install the dependencies, run the following command:

```bash
yarn install
```

Launch database

```bash
docker-compose up -d
```

Install directus

```bash
npx directus bootstrap && npx directus database install

```

Use the following credentials:

email: admin@admin.com  
password: admin

To start in development mode, run the following commands:

```bash
docker-compose up -d
```

and

```bash
yarn dev
```
