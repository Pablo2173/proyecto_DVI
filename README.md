# THE DUCKLER

## Resumen
### Descripción
The Duckler es un juego en el que controlamos a un pato que está muy enfadado porque es el último pato del parque ya que este ha sido invadido por depredadores. El pato juró venganza y se dispone a limpiar su hogar. En su ataque desbocado usará cualquier cosa que tenga a mano, desde ramas tiradas por el suelo hasta algunas armas más sofisticadas de sus enemigos caídos, como magia arcana o armamento militar avanzado.

### Género
RPG de acción rápida top-down. Videojuego pixel art de aventura hack and slash.

### Setting
El protagonista es un patito sin nombre que vive en un parque público. Un día, este parque es invadido por depredadores y nuestro patito es el único superviviente ya que en ese momento se estaba echando su típica siesta mañanera. Lleno de pena y, sobre todo, rabia, nuestro patito jura tomar venganza por sus amigos y relativos perdidos. Recorrerá las diferentes secciones del parque azotando, quemando, cortando, golpeando y muchos más “-ando” con cualquier cosa que pueda ser considerada un arma que tenga a mano, recolectando las plumas de sus antiguos amigos en el camino, ocasionalmente encontrando charquitos para siestear y soñar con más muerte y destrucción.

## Gameplay

### Objetivo del juego

El objetivo del juego es alcanzar al jefe final y derrotarlo.
Dentro de cada zona el jugador quiere llegar al final perdiendo la cantidad mínima de plumas. El jugador quiere lidiar con los enemigos para conseguir mejores armas, la posibilidad de recuperar plumas y poder usarlas para mejorar sus estadísticas en cada punto de control.
El juego termina cuando el jugador alcanza el jefe final y lo derrota.

### Core loops
- Loop de exploración
Jugador llega a una nueva zona -> lidia con los nuevos enemigos en el camino -> encuentra puntos de control intermedios -> derrota al jefe de la zona ->

 - Loop de combate
Jugador usa su arma para derrotar enemigos -> enemigos dropean armas al morir -> arma del jugador se rompe tras su uso -> jugador equipa nuevas armas encontradas ->

 - Loop de mejora
Jugador empieza nueva zona con todas sus plumas -> pierde plumas al ser golpeado -> encuentra plumas por el mapa / al derrotar enemigos -> llega al punto de control y puede gastar sus plumas en mejoras.

## Mecánicas

### Cambiar/equipar armas

El jugador puede encontrar armas escondidas y repartidas por el mapa o estas pueden ser soltadas por los enemigos al ser derrotados. El jugador puede interactuar con estas armas para equiparlas, intercambiandolas con el arma que tenga equipada actualmente, si tiene ya una, soltando la anterior en el suelo.

### Movimiento

El jugador puede mover al personaje en los ejes x e y desde un punto de vista satelital. El jugador podrá hacer mover al personaje con el uso de las teclas de dirección o las teclas wasd.

### Armas

Existen múltiples tipos de armas que el jugador puede obtener y usar. Cada arma tiene un sistema único pero todas tienen estadísticas de velocidad de ataque, rango efectivo, duración y barra de carga. Cuando la duración del arma llega a 0 esta se rompe. 

### Combate

Tanto el jugador como los enemigos pueden usar su arma equipada. El jugador puede pulsar click izquierdo para usar el ataque definido por el arma equipada en la dirección del ratón. Los enemigos usan una IA que controla cómo comportarse en torno a la presencia del jugador según su estado de alerta y arma equipada. Al pegar a un enemigo la pantalla se tambalea muy levemente.

### Sistema de plumas

El jugador comienza cada zona con 5 plumas, adicionales pueden encontrarse por el mapa o ser soltadas por enemigos específicos al ser derrotados. Recibir un golpe hace al jugador perder una pluma y, si no le quedan plumas, el jugador es derrotado y regresa al último charquito visitado. Las plumas pueden usarse para mejorar las estadísticas del personaje en un charquito.

### Monedas panaderas

Éste es el sistema de compra del juego, son monedas de pan las cuales sueltan los enemigos o puedes encontrarlas dispersas por el mapa. Sirven para comprar cosas en la Ranita Comerciante la cual se explica más adelante, y para usar la “The Toaster” la cual también es explicada más adelante.

### Charquitos

Son zonas intermedias donde no hay enemigos y el jugador puede usar las plumas para mejorar sus estadísticas. Las estadísticas a mejorar son las contramuslo (cómo de rápido se mueve el jugador), alitas (como de fuerte pegan sus armas) y gracia patuna (duración de las armas). Un charquito puede ser vaciado a cambio de una pluma extra y de perderlo como punto de control.

### Deja Vu

Así es como es conocida la mecánica de derrota de nuestro jugador. Como el jugador es derrotado al quedarse sin plumas, al reaparecer recuperas 5 plumas, y si regresas al lugar en el que has muerto previamente, recuperas 1 pluma adicional.

### Jefe de zona

Al final del recorrido delimitado de una zona, hay un enemigo especial que pone a prueba la habilidades que el jugador debe haber aprendido durante el recorrido.

### Sistema de esquivas

El jugador puede pulsar la barra espaciadora para realizar un movimiento rápido en la dirección en la que el jugador se está moviendo en ese momento. Durante el proceso de esquiva el jugador es inmune a todo tipo de daño durante un corto periodo de tiempo y tampoco puede usar armas durante un periodo de tiempo ligeramente superior. Esta esquiva tiene un periodo de recarga que es indicado visualmente en pantalla.

### Cuack

El jugador puede hacer “cuack” al pulsar la tecla c, esto alerta a todos los enemigos del area para que vengan a atacar al jugador.


## Interfaz

### Controles

Falta la imagen

Amarillo -> Controles de movimiento

Azul -> Dash

Verde -> Cuack

### Cámara

La cámara es dinámica, se centra en el pato pero se desliza hacia la posición del ratón.

### HUD

El HUD contiene información sobre:
 - El número de vidas(plumas) que les quedan al jugador.
 - El número de monedas panaderas que tiene el jugador.
 - Barra de duración de las armas.
 - Barra de carga del dash.
 - Pociones y objetos de los que dispone el jugador.
 - Botón de ajustes.

## Menús

### Level up

Menú en los charquitos que muestra tres cajas, cada una mostrando una de las tres estadísticas que el jugador puede mejorar para el pato: velocidad, fuerza y eficiencia de armas. Mejorar estas estadísticas cuesta plumas, empezando todas en coste 1 y ascendiendo en 1 por cada mejora comprada. Estas cajas contienen un icono representativo de la estadística que mejoran y muestran el número de coste para mejorar el arma que a su vez también representa el nivel al que se encuentra dicha estadística.

## Mundo del juego

### Personaje principal (Pato)

El pato es el protagonista del juego y es la representación del jugador dentro del mismo. Su comportamiento se describe en la sección de mecánicas. Las dimensiones del pato son de proporción 64x64 pixeles.

### Enemigos

En el juego hay varios tipos de enemigos que pueden matar al jugador. Todos tienen comportamientos similares de base pero estos cambian según las armas que tengan equipadas y sus estadísticas propias. Los comportamientos compartidos:
Si no han detectado al jugador, entran en estado idle. Algunos caminarán sin rumbo fijo, otros se quedarán quietos, etc.
Si han detectado al jugador, se moverán a su alrededor buscando la distancia idónea para el uso de su arma equipada y, entonces,  atacarán en la dirección del jugador.
Los enemigos aparecen en posiciones predeterminadas en el mapa y su estado de inicio es idle. Existen excepciones si se cumplen requisitos específicos.
Los enemigos tienen barras de salud invisibles para el jugador, estas barras pueden ser vaciadas al recibir ataques del jugador y una vez su salud alcanza 0 estos mueren y dejan un cadáver que desaparece al cabo de un tiempo.

#### - **Pollito navajero**
(finalmente no implementado)
Enemigo introductorio, vida media y ataques básicos a melee.

 - Preferencia de arma: A melee
 - Puntos de salud: 11 
 - Velocidad de movimiento: x1 

“pollo de barrio…”

#### - **Zorro con antifaz**
Enemigo introductorio, vida media y ataques básicos a melee y a distancia.

 - Preferencia de arma: cualquiera
 - Rango de visión: 750
 - Puntos de salud: 60 
 - Velocidad de movimiento: 140 

“Le roba a los ricos y se lo da a sí mismo”

#### - **Mapache con marcas de llantas**
Una vez su hp alcanza 0, éste resucita y necesita ser matado otra vez.

 - Preferencia de arma: A melee
 - Rango de visión: 750
 - Puntos de salud: 65
 - Velocidad de movimiento: 100

“Se nota que el accidente le dejó secuelas”

#### - **Cuervo**
Este enemigo aparece sin armas.
Si el cuervo alcanza al jugador, este robará su arma y modificará su comportamiento al predeterminado de ataque.
Este enemigo no aparece de forma natural, solo spawnea si el jugador pasa más de 1 minuto sosteniendo la misma arma. Si el jugador cambia de arma mientras el cuervo está en pantalla, el cuervo saldrá volando y desaparecerá.

 - Preferencia de arma: Todas
 - Puntos de salud: 60
 - Velocidad de movimiento: 150

“Le atraen las cosas de valor… valor emocional”

#### - **Rata con sombrero de chef**
(finalmente no implementado)
Este enemigo tiene la habilidad especial de volverse invisible si se encuentra lo suficientemente alejado del jugador.
Este enemigo puede detectar al jugador desde cualquier ángulo y más lejos de lo normal, pero cuando lo detecta hace un sonido característico.

 - Rango de detección: x3
 - Preferencia de arma: cuchillos
 - Puntos de salud: 3 (muy frágil)
 - Velocidad de movimiento: x1.25 (Rápido)

“Un día probó pato a la boloñesa y ya no hay quien lo pare”

#### - **Águila**
(finalmente no implementado)
Suena un sonido (de águila) y lo siguiente es ver una sombra que pasa por la pantalla. Mientras está pasando la sombra tienes que estar en modo sigilo (con la cabeza dentro del suelo o en estado invisible) para que no te descubra. Si te descubre se lanza contra ti y mueres al instante.

#### - **Pingüino defensor**
(finalmente no implementado)
Este enemigo se caracteriza por tener 2 tipos diferentes de ataque:
El barrido con lanza: El enemigo hace un giro sobre sí mismo haciendo un círculo de daño en área alrededor de él.
Carga con lanza: El enemigo carga hacia la dirección del jugador, se multiplica su velocidad x3.5 y su daño x2, y se detiene al alcanzar cierta distancia o al encontrarse con un obstáculo.

 - Rango de detección: x1
 - Preferencia de arma: A melee
 - Puntos de salud: 15 (normal)
 - Velocidad de movimiento: x0.8 (Lento)
 - Velocidad de movimiento con carga: x3.5
 - Multiplicador de daño con carga: x2

“Es un fiel defensor de sus territorios, y no dudará en atacar a todo aquel que ose entrar en ellos”

#### - **General Palomo**
(finalmente no implementado)
Si este enemigo te detecta, todos los enemigos que se encuentren dentro del área también te detectarán e irán a por ti. Éste se caracteriza por siempre mantenerse a una distancia “prudente” e intenta siempre estar por detrás del resto de enemigos.

 - Rango de detección: x2.5
 - Preferencia de arma: A distancia
 - Puntos de salud: 15 (normal)
 - Velocidad de movimiento: x1 (Normal)

“Manda siempre a sus súbditos a batalla para usarlos como escudo y así siempre poder salvarse…”

#### - **Chinchilla cadete**
(finalmente no implementado)
Este enemigo está armado con una M.Cuacktro, y cuando te detecte, disparará en todas direcciones.

 - Rango de detección: x2
 - Preferencia de arma: A distancia
 - Puntos de salud: 7 (Frágil)
 - Velocidad de movimiento: x1 (Normal)

“Este cadete se pone muy nervioso en situaciones de peligro y por ende hace lo único que le han enseñado a hacer, apretar el gatillo”

#### - **Búho hechicero oscuro**
(finalmente no implementado)
Este enemigo puede disparar a sus aliados (otros enemigos que haya en la zona) para darles más vida y más ataque.

 - Rango de detección: x2
 - Preferencia de arma: A distancia mágicas
 - Puntos de salud: 11 (Un poco frágil)
 - Velocidad de movimiento: x1 (Normal)

“Este hechicero oscuro está licenciado en las artes del control de almas, pudiendo así fortalecer las de sus compañeros”

#### - **Tortuga Necromante**
(finalmente no implementado)
Este enemigo se caracteriza por tener una gran cantidad de vida pero ser muy lenta.

 - Rango de detección: x1,7
 - Preferencia de arma: A distancia mágicas
 - Puntos de salud: 17 (bastante vida)
 - Velocidad de movimiento: x1 (Normal)

“Este hechicero oscuro está licenciado en las artes del control de almas, pudiendo así fortalecer las de sus compañeros”

#### - **Gato lanzapociones**
(finalmente no implementado)
Éste enemigo es un enemigo a distancia el cual lanza pociones desde lejos las cuales hacen daño al jugador pero hay una pequeña probabilidad también de que le otorguen una pluma adicional en vez de hacer daño al jugador.

 - Rango de detección: x1,3
 - Preferencia de arma: A distancia mágicas
 - Puntos de salud: 6 (débil)
 - Velocidad de movimiento: x1 (Normal)

“Éste lindo felino se caracteriza por robar pociones a los magos para usarlas en su propio beneficio”

### Jefes finales de zona

#### **Jabalí carnicero**
(finalmente no implementado)
Jefe de la segunda zona jugable del juego (el bosque).
 - Ataques primera fase:
    - Ataque básico: Ladea la cabeza haciendo un ataque similar al de una espada, ataque más común del jefe el cual causa 1 de daño en el jugador si éste es alcanzado por él.
    - Embestida: Potente carga hacia donde está mirando con la que gana mucha velocidad y si embiste al jugador le causará 2 plumas de daño. La embestida para después de una distancia predefinida (por determinar) o al chocar con un obstáculo. Si choca contra un obstáculo éste se quedará estuneado durante 3 segundos.
 - Ataques segunda fase:
    - Chillido ensordecedor: Hace un chillido el cual hace daño en área alrededor del jefe en todas direcciones. Este ataque causa una pluma de daño.
    - Lanzamiento de lodo: El jabalí se posiciona encima de uno de los charcos de lodo que hay en su área de combate y lanza lodo hacia la dirección que está mirando con gran rango de alcance.
“Éste carnicero sangriento aprovechó la situación del parque para ir a sembrar el caos”


#### **Cocodrilo genocida**
Jefe final de la última zona del juego (la alcantarilla).
 - Implementación final del jefe:
    - Dentro del agua: 
Persigue al jugador a gran velocidad y le causa daño de impacto.
    - Fuera del agua: 
Persigue al jugador a menor velocidad y al entrar en rango carga un ataque de coletazo.
    - En ambos terrenos: 
Cuando el jugador se aleja mucho del cocodrilo, éste carga un ataque a distancia en el que lanza burbujas.

Implementación inicial que queríamos hacer pero que finalmente no fue posible por falta de tiempo: 
 - Primera fase:
Van apareciendo ratas en el area de combate mientras que el cocodrilo persigue al jugador.
    - Patron 1: Se mueve lentamente hacia el pato hasta que entra en rango corto y le pega un bocado inmediato.
    - Patrón 2: Se mueve más rápido que el pato y con más rango. Cuando tiene al pato en rango, carga un ataque te coletazo.

 - Fase intermedia:
El agua se eleva, inundando gran parte del area de combate y el jugador tiene que drenarla golpeando 3 válvulas en los extremos laterales y el superior donde han quedado tres pequeñas islas.
Durante esta fase el cocodrilo ronda por el agua y el jugador tiene que alcanzar estas islas evitandolo.

 - Ataques segunda fase:
    - Patron 1: Se mueve a la misma velocidad base del pato y hacia el pato hasta que entra en rango corto y le pega un bocado inmediato.
    - Patrón 2: Se mueve más rápido que el pato y con más rango. Cuando tiene al pato en rango, carga un ataque te coletazo. Lo repite hasta tres veces cada coletazo más rápido que el anterior.
    - Patrón 3: Se mueve hacia el centro de la pantalla y el empieza a disparar burbujas en círculo, cada vez más rápido formando un patrón de espiral y forzando al jugador a usar el dash para esquivar.

“Este cocodrilo quería entrar en la academia de artes de los patos, pero cuando le rechazaron este les juró venganza, convirtiéndose en un depredador sanginario y peligroso.”

### Armas

 - **Ramita**
Arma predeterminada de todos los personajes, cuando pierda el arma equipada se equipará automáticamente con esta.

Tipo de arma: Melee
Distancia de ataque: Corta
Ataque base: 15
Velocidad de ataque: 0.7s
Necesita cargar ataque: No
Durabilidad: Infinita
Enemigo que puede soltarla: Ninguno


 - **Cuchillo**
Al rodar te haces invisible por un periodo corto de tiempo, con un tiempo de recarga más largo.

Tipo de arma: Melee
Distancia de ataque: Corta
Ataque base: 20
Velocidad de ataque: 1s (Algo lenta)
Necesita cargar ataque: No
Durabilidad: 6
Enemigo que puede soltarla: Enemigos con cuchillo.

 - **Arco**
Mantener pulsado el click izquierdo carga el arma con tres secciones en la barra de carga dividida en 3 secciones, llenar cada sección tarda más que la anterior pero hace mas daño también.

Tipo de arma: A distancia
Distancia de ataque: Muy larga
Ataque base: 30
Ataque a máxima carga: 45
Velocidad de ataque: 0.5s
Necesita cargar ataque: Sí
Durabilidad: 8
Enemigo que puede soltarla: Cualquier enemigo con arco (principalmente el zorro).


 - **M.Cuacktro**
Al mantener click izquierdo, aumenta la barra de carga que implica más dispersión y más cadencia pero menor precisión proporcional a la carga de la barra.

Tipo de arma: A distancia
Distancia de ataque: Muy larga
Ataque base: 8
Velocidad de ataque: 0.2s (Muy rápida)
Necesita cargar ataque: No
Durabilidad/Munición: 70
Enemigo que puede soltarla: Ninguno, se compra en la tienda.

 - **Lanza**
(finalmente no implementado)
Mantener pulsado click izquierdo carga la barra y al soltar, se lanza en esa dirección haciendo daño de forma proporcional. Si se carga la primera mitad hace una estocada y la segunda mitad ataque en carrera

Tipo de arma: A melee
Distancia de ataque: Larga
Ataque base: 5
Velocidad de ataque: 0.9s 
Necesita cargar ataque: No
Durabilidad: 15
Enemigo que puede soltarla: Pingüino lancero defensor


 - **Paloma cagona**
(finalmente no implementado)
Se recarga automáticamente la barra de carga. Cuando está rellena al hacer click dispara una bala muy rápida y que hace mucho daño, vaciando la carga en disparo.

Tipo de arma: A distancia
Distancia de ataque: Muy larga
Ataque base: 10
Velocidad de ataque: 3s (Muy lenta)
Necesita cargar ataque: Si (2s de tiempo de carga)
Durabilidad: 15
Enemigo que puede soltarla: General palomo

 - **Bastón catalizador**
(finalmente no implementado)
Dispara bolitas mágicas. Tendrá una barra de maná que se consumirá cuando dispares. La barra se recarga con el tiempo y si está gastada el arma se rompe.

Tipo de arma: A distancia
Distancia de ataque: Muy larga
Ataque base: 5
Velocidad de ataque: 1s 
Necesita cargar ataque: No
Durabilidad: 20
Enemigo que puede soltarla: Búho hechicero oscuro

 - **Mazo de juguete**
Arma pesada que golpea a los enemigos en área. Hace mucho daño pero tarda mucho en cargar un ataque. Cuando se recarga la barra completa se puede hacer un ataque que hace daño en todas las direcciones y empuja los enemigos hacia atrás.

Tipo de arma: A melee
Distancia de ataque: Media
Ataque base: 20
Velocidad de ataque: 5s
Necesita cargar ataque: Si
Durabilidad: 5
Enemigo que puede soltarla: Ninguno, se compra en la tienda.

 - **The Toaster**
(finalmente no implementado)
Éste arma lanza monedas de las que dispone el jugador, por lo que tendrá munición hasta que éste se quede sin monedas. Éste arma está balanceada debido a que si tienes el arma durante mucho rato aparece el cuervo.

Tipo de arma: A distancia
Distancia de ataque: Larga
Ataque base: 15
Velocidad de ataque: 1s
Necesita cargar ataque: No
Durabilidad: infinita
Enemigo que puede soltarla: Ranita comerciante (probabilidad de 50%), la suelta al morir o también puede ser comprada en la tienda si sale en la pool.

 - **Expatidur**
(finalmente no implementado)
Espada normal que al romperse le otorga una pluma al jugador.

Tipo de arma: Melee
Distancia de ataque: Media
Ataque base: 6
Velocidad de ataque: 1.2s (Algo lenta)
Necesita cargar ataque: No
Durabilidad: 15 
Enemigo que puede soltarla: Por definir

 - **Espada Maestra**
(finalmente no implementado)
Espada la cual al gastar la durabilidad no se rompe pero reduce mucho el daño hasta que se vuelva a cargar.

Tipo de arma: Melee
Distancia de ataque: Media
Ataque base: 6
Velocidad de ataque: 1.2s (Algo lenta)
Necesita cargar ataque: No
Durabilidad: 15 
Enemigo que puede soltarla: Por definir

### NPCs

#### Ranita comerciante
Vende pociones a cambio de dinero que el pato (el jugador) se va encontrando según va avanzando en la partida. Ésta ranita aparece en diferentes ubicaciones del mapa predefinidas. Si le pegas 2 golpes a la rana, ésta se enfada y se convierte en un enemigo. Si la rana es derrotada, ya no volverá a aparecer en toda la partida. Al morir puede soltar “The Toaster” y suelta una gran cantidad de monedas panaderas. (esto último finalmente no pudo ser implementado)
-> Funcionamiento de la tienda: Los objetos aparecen aleatoriamente en el suelo en el área de la tienda junto con su precio, y se compran al ponerte encima y pulsar el botón de coger el objeto. En la tienda habrá un botón de reroll el cual cuesta dinero que se indicará, y éste recarga los items disponibles en la tienda. Cada vez que se usa el reroll el precio se multiplica por 2.

#### Avestruz
(finalmente no implementado)
Hablará con el jugador después de la zona inicial del juego y le otorgará la habilidad de sigilo después de la conversación la cual el jugador podrá usar para hacer gerente al águila.

### Objetos
Los objetos que va a haber en el juego son los vendidos por la ranita comerciante, los cuales van a ser los siguientes:
 - **Poción de ataque:** Después de consumirla otorga al jugador el doble de daño de ataque durante 30 segundos. Después de consumir este objeto éste desaparece del inventario.
 - **Poción de velocidad:** Después de consumirla otorga al jugador el doble de velocidad de movimiento durante 15 segundos. Después de consumir este objeto éste desaparece del inventario.
 - **Poción de velocidad de ataque:** Después de consumirla otorga al jugador el doble de velocidad de ataque durante 20 segundos. Después de consumir este objeto éste desaparece del inventario.
 - **Poción de armadura:** Después de consumirla otorga al jugador una reducción de daño recibido del 50% durante 30 segundos. Después de consumir este objeto éste desaparece del inventario. (finalmente no implementado)
 - **Estrella invencible:** Después de consumirla otorga al jugador invencibilidad total (no puede recibir daño) durante 30 segundos. Después de consumir este objeto éste desaparece del inventario. (finalmente no implementado)
 - **Dropeador de arma aleatoria:** Cuando usas este ítem suelta un arma aleatoria en el suelo. (finalmente no implementado)
 - **Pluma de gorrión:** Sirve como una pluma, te permite recibir un golpe, pero al llegar a un charquito se pierde. (finalmente no implementado)
 - **Corneta de llamamiento:** Al usarla un  gran grupo de gallinas invaden la pantalla causando daño a todo lo que golpeen. (finalmente no implementado)

### Trampas
(finalmente no implementado)
Trampas poco visibles por el escenario las cuales pueden ser activadas tanto por el jugador como por los enemigos.


## Zonas

### Entrada al parque
Primera zona del juego donde se enseñan y se ponen a prueba todas las mecánicas del juego, con variedad de enemigos y distintas zonas a explorar. (Éste es un plano en modo boceto)

Falta imagen

### Bosque
(finalmente no implementado)
Primera zona principal con 2 subzonas y un jefe.

### Campamento militar
(finalmente no implementado)
Segunda zona principal con 2 subzonas y un jefe.

### Pantano mágico
(finalmente no implementado)
Tercera zona principal con 2 subzonas y un jefe.

### Alcantarilla
Zona final del juego con el jefe cocodrilo genocida.


## Referencias
 - Referencias de juegos

DARK SOULS | Sitio Web Official (ES)

Soul Knight

HOTLINE MIAMI

Nuclear Throne

 - Referencias de tipografía

Tipografía menu : https://fonts.google.com/specimen/MedievalSharp

Menu: https://opengameart.org/content/simple-natural-landscape-pixel-art-background



