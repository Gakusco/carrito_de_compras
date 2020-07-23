(function() {
    var fechaYHora = function() {
        var domDia = document.getElementById("dia");
        var domMes = document.getElementById("mes");
        var domAnio = document.getElementById("anio");

        var domHora = document.getElementById("hora");
        var domMinuto = document.getElementById("minuto");
        var domSegundo = document.getElementById("segundo");

        var fechaYHora = new Date();

        if (fechaYHora.getDay() < 10) {
            domDia.textContent = "0" + fechaYHora.getDay();
        } else {
            domDia.textContent = fechaYHora.getDay();
        }

        var meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "noviembre", "diciembre"];
        domMes.textContent = meses[fechaYHora.getMonth()];

        domAnio.textContent = fechaYHora.getFullYear();

        if (fechaYHora.getHours() < 10) {
            domHora.textContent = "0" + fechaYHora.getHours();
        } else {
            domHora.textContent = fechaYHora.getHours();
        }

        if (fechaYHora.getMinutes() < 10) {
            domMinuto.textContent = "0" + fechaYHora.getMinutes();
        } else {
            domMinuto.textContent = fechaYHora.getMinutes();
        }

        if (fechaYHora.getSeconds() < 10) {
            domSegundo.textContent = "0" + fechaYHora.getSeconds();
        } else {
            domSegundo.textContent = fechaYHora.getSeconds();
        }
    }

    fechaYHora();
    setInterval(fechaYHora, 1000);

    var codigoForm = document.getElementById("codigoForm");
    var cantidadForm = document.getElementById("cantidadForm");
    var btnAgregar = document.getElementById("agregar");
    var tabla = document.getElementById("tabla");

    var montoIngresado = document.getElementById("pagando");
    var btnPagar = document.getElementById("btnPagar");
    var total = document.getElementById("total");
    var pago = document.getElementById("pago");
    var cambio = document.getElementById("cambio");

    var msjErrorMonto = document.getElementById("msjErrorMonto");
    var msjErrorCodigo = document.getElementById("msjErrorCodigo");
    var msjErrorCantidad = document.getElementById("msjErrorCantidad");

    var sumaTotal = 0;

    var producto = ["harina.png#harina#3200",
        "leche.png#leche#2020",
        "yogurt.png#yogurt#3550",
        "mantequilla.png#mantequilla#1200",
        "vizzio.jpg#vizzio#1120",
        "manzana.jpg#manzana#550",
        "mortadela.jpg#mortadela#890",
        "naranja-fruta.jpg#naranja#1500",
        "pan_trigo.jpg#pan#550",
        "ramitas.jpg#ramitas#900"
    ];

    var agregarProducto = function() {
        msjErrorCodigo.textContent = "";
        msjErrorCantidad.textContent = "";
        pago.textContent = "";
        cambio.textContent = "";
        if (codigoForm.value >= 10 || codigoForm.value < 0 || codigoForm.value == "") {
            codigoForm.value = "";
            codigoForm.className = "error";
            msjErrorCodigo.textContent = "Código inválido";
            return false;
        }

        if (cantidadForm.value < 1) {
            cantidadForm.value = "";
            cantidadForm.className = "error";
            msjErrorCantidad.textContent = "Cantidad inválida";
            cantidadForm.setAttribute("placeholder", "Cantidad inválida");
            return false;
        }

        var codigoProducto = codigoForm.value; //2
        var split = producto[codigoProducto].split("#");
        var imagen = split[0]; //imagen.jpg
        var descripcion = split[1]; //mantequilla de 100g
        var precio = split[2]; //22.200
        var cantidad = cantidadForm.value; //5
        var monto = cantidad * precio; //22.200*5 = 111.000

        //Validar que no se encuentre el producto que deseo agregar, en la tabla
        if (tabla.children.length > 1) {
            var tr = tabla.children;
            for (var i = 1; i < tr.length; i++) {
                var descripcionDeLaTabla = tr[i].children[1].textContent;
                if (descripcionDeLaTabla == descripcion) {
                    codigoForm.value = "";
                    codigoForm.className = "error";
                    msjErrorCodigo.textContent = "Ya agregó el producto " + descripcion + " (" + codigoProducto + ") a la lista";
                    return false;
                }
            }
        }


        //Creación de elementos
        var trCuerpo = document.createElement("tr");
        var tdImagen = document.createElement("td");
        var imagenDelTd = document.createElement("img");
        var tdProducto = document.createElement("td");
        var tdPrecioUnitario = document.createElement("td");
        var tdCantidad = document.createElement("td");
        var tdMonto = document.createElement("td");

        //Cambio de atributos
        trCuerpo.className = "cuerpo";
        tdImagen.className = "imagen";

        //Llenado de la tupla
        imagenDelTd.setAttribute("src", "imagenes/" + imagen);
        imagenDelTd.className = "tamanioImagen";
        tdProducto.textContent = descripcion;
        tdPrecioUnitario.textContent = precio;
        tdCantidad.textContent = cantidad;
        tdMonto.textContent = monto;

        tdImagen.appendChild(imagenDelTd);
        trCuerpo.appendChild(tdImagen);
        trCuerpo.appendChild(tdProducto);
        trCuerpo.appendChild(tdPrecioUnitario);
        trCuerpo.appendChild(tdCantidad);
        trCuerpo.appendChild(tdMonto);

        tabla.appendChild(trCuerpo);

        sumaTotal += monto;
        total.textContent = sumaTotal;

        codigoForm.value = "";
        cantidadForm.value = "";

        for (var i = 0; i < tabla.children.length; i++) {
            tabla.children[i].addEventListener("click", eliminarProducto);
        }
    }


    var validarCodigoForm = function() {
        codigoForm.className = "codigoForm";
        codigoForm.setAttribute("placeholder", "Ingrese un código del 0 al 9");
    }

    var validarCantidadForm = function() {
        cantidadForm.className = "cantidadForm";
        cantidadForm.setAttribute("placeholder", "");
    }

    var procesarPago = function() {
        if (montoIngresado.value < sumaTotal || montoIngresado.value == "") {
            montoIngresado.value = "";
            montoIngresado.className = "error";
            msjErrorMonto.textContent = "El monto ingresado es inferior al total de la compra";
            return false;
        }

        if (tabla.children.length == 1) {
            montoIngresado.value = "";
            montoIngresado.className = "error";
            msjErrorMonto.textContent = "No ingresó productos";
            return null;
        }

        msjErrorMonto.textContent = "";

        pago.textContent = montoIngresado.value;
        cambio.textContent = montoIngresado.value - sumaTotal;

        montoIngresado.value = "";
    }

    var validarPago = function() {
        montoIngresado.setAttribute("placeholder", "");
        montoIngresado.className = "pagando";
    }

    var eliminarProducto = function() {
        var precioARestar = this.children[4].textContent;
        sumaTotal -= precioARestar;
        if (sumaTotal > 0) {
            total.textContent = sumaTotal;
        } else {
            total.textContent = "";
        }
        pago.textContent = "";
        cambio.textContent = "";
        tabla.removeChild(this);
    }

    montoIngresado.addEventListener("click", validarPago);

    btnPagar.addEventListener("click", procesarPago);

    cantidadForm.addEventListener("click", validarCantidadForm);

    codigoForm.addEventListener("click", validarCodigoForm);

    btnAgregar.addEventListener("click", agregarProducto);

}());