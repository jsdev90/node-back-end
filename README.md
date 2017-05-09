# Proyecto Base

Built with node


Proyecto de backend que sirve como base para los desarrollos.
Las principales tecnologias del proyecto son:

* ExpressJS           → http://expressjs.com/
* Mongoose            → http://mongoosejs.com/docs/guide.html
* Moment              → http://momentjs.com/docs
* Lodash              → https://lodash.com/docs
* Gulp                → http://gulpjs.com/
* Nodemon             → http://nodemon.io/
* Mocha               → http://mochajs.org/#getting-started
* Supertest           → https://www.npmjs.com/package/supertest
* Chai                → http://chaijs.com/


> Este proyecto usa Node.js y Nodemon para ejecutarse y construirse.


## Instalar Node:

    wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash

### Cargar nvm en la sesión actual

    source ~/.bashrc

Una vez cargado nvm en sesión, se debe instalar node ejecutando el siguiente comando el siguiente comando:

    nvm install 4.0

Luego, para usar node, se debe hacer:

    nvm use 4.0

>Se puede agregar ese comando al final del .bashrc para que se cargue nvm automáticamente

Fuente: https://github.com/creationix/nvm

### Instalar paquetes de node necesarios:
Desde cualquier ubicación ya que se van a instalar de forma global:

    npm install -g gulp nodemon mocha

### Configurar el proyecto
Luego de hacer el fork y clonar el proyecto, se debe hacer desde el directorio raíz:

    npm install

## Comandos de gulp

>Los comandos se pueden encontrar en el archivo ./gulp/tareas.js

El proyecto proveé una serie de comandos para ayudar en el desarrollo:

[comment]: <> (COMANDOS:INICIO)

### Herramientas de QA

* gulp js:hint          → valida el código en busca de errores comunes
* gulp js:inspect       → valida que no haya código copiado
* gulp js:complexity    → evalua la complejidad del código
* gulp js:cs            → valida el estilo de codificación y formatea el código
* gulp js:qa            → Ejecuta js:hint, js:complexity, js:cs y js:inspect

### desarrollo
* gulp serve            → levanta el servidor y escucha los cambios de código para refrescarlo.
* gulp                  → ejecuta gulp serve

### Generación de código

* gulp generar --modulo [NombreModulo] → genera un módulo con el nombre NombreModulo

### Otros

* gulp help             → Imprime todos los comandos disponibles
* gulp util:size        → tamaño de los archivos del proyecto
* gulp util:loc         → cantidad de líneas de código del proyecto
* gulp util             → ejecuta util:size y util:loc

[comment]: <> (COMANDOS:FIN)


#### Por defecto, el comando default es gulp serve
Esto quiere decir, que con sólo hacer:

    gulp

estaremos ejecutando:

    gulp serve


## Correr los tests
Nada más con ejecutar el comando de mocha corre todos los tests

    mocha --recursive

## Generador de módulos
El proyecto incluye un comando para generar todos los archivos básicos de un nuevo módulo:

    gulp generar --modulo <NOMBRE DEL MODULO>