class GameItem {
    constructor(element, x = 0, y = 0) { // `constructor` es una palabra reservada
        this.x = x;
        this.y = y;
        this.element = element;
        this.render();
    }

    // Renderiza la posición en pantalla
    render() {
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
    }
}