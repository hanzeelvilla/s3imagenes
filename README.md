# Como guardar imágenes en S3

## Requisitos
1. Cuenta de AWS

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
```

9. Correr el servidor

```
node app.js
```