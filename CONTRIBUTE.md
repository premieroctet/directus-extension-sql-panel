To install the dependencies, run the following command:

```bash
yarn install
```

launch database

```bash
docker-compose up -d
```

install directus

```bash
npx directus bootstrap && npx directus database install

```

install ADMIN role

```
npx directus roles create --role ADMIN --admin true
```

Copy the uuid of the role and paste it in the next command
create user

```
npx directus users create --email admin@admin.com --password admin --role <uuid>
```

To start in development mode, run the following commands:

```bash
docker-compose up -d
```

and

```bash
yarn dev
```
