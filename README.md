# Prueba tecnica para Inversiones del pacifico

## Desarrollado por: JOSE MANUEL CORTES CORTES
  
    phone: +57 3154359251
    whatsAp: +37 3163962145
    email: jose.cortes.cortes@correounivalle.edu.co
  

## Descripción
Aplicación web desarrollada con React + TypeScript, diseñada principalmente para el calculo del salario a devengar, se tomo en cuenta las horas extras y los recargos nocturnos. 
 
 * Para TODOS los tipos de horario define que tiene una hora de almuerzo si su hora de salida del control de acceso es superior a las 14hrs, la hora de almuerzo va de 12-14, esto para evitar contar este rango como hora extra 😉

 * Modifique algunos de las horas de salida en el control de acceso para varios empleados, esto para corrovorar que las funnciones estaban bien 👍
## Tecnologías Utilizadas
- <img src="/src/assets/react.svg" height="60"> React
- <img src="/src/assets/ts.png" height="60"> TypeScrip
- <img src="/src/assets/ant.svg" height="60"> Ant Design (antd) - Libreria de componentes 
- <img src="/src/assets/react-router-icon-dom.png" height="60"> React Router DOM 
- <img src="/src/assets/vite.png" height="60"> Vite 
- <img src="/src/assets/moment.png" height="60"> Moment.js - Libreria para manejo de fechas 

## Imagenes de la interfaz


### Listado de empleados


![Listado de empleados](/src/assets/listado.png)
  - Se puede hacer la busqueda de los empleados por informacion de cada columna, dandole click al icono de lupa
  - Ordena a los empleados por el salario que tienen, ascendente o descendente


### Informacion general de empleado
![Informacion general de empleado](/src/assets/info-empleado.png)
  - Muestra los atributos del empleado
  - Horario asignado
  - Control de acceso
  - Clasificacion de hora extras y recargos


### Informacion de salario de empleado
![Informacion de salario de empleado](/src/assets/info-salario.png)
  - Tabla con el total de horas extras, valor de cada uno segun el salario del empleado, y total a pagar por horax y recargos
  - Salario base
  - Adicionales (extras + recargos)
  - Salario a devengar (salario base + adicionales)


