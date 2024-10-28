# Como guardar imágenes en S3

## Requisitos
1. Cuenta de AWS
2. Mysql
3. Extensión Prisma
4. Extensión REST Client

## Configuración

1. Instalar dependencias

```
npm i
```

2. Crear un bucket en AWS
3. Crear una nueva política para el servicio S3 con: **GetObject**, **PutObject** y **DeleteObject**
4. En resources seleccionar el bucket creado y **any** en todos los objetos
5. Crear un usuario
6. Agregar la política al usuario
7. Generar un ID de clave de acceso
8. Crear el archivo .env

```
BUCKET_NAME=your_bucket_name
BUCKET_REGION=your_bucket_region
ACCESS_KEY_ID=your_access_key_id
SECRET_ACCESS_KEY=your_secret_access_key
DATABASE_URL="mysql://username:password@host:port/database_name"
```

> [!NOTE]
> El puerto default en WSL de MySQL es 3306

10. Crear el esquema en prisma
```
npx prisma db pull
```

11. Migrar la bd
```
npx prisma migrate dev --name init
```

12. Correr el servidor
```
node app.js
```

> [!WARNING]
> No se ha recortado la imagen para limitar los bytes a guardar en el bucket ni se ha validado que sean imágenes válidas