//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

//Caracteristicas del contrato
contract SalesContract{
    address payable propietario;
    uint256 public tiempoActualizar;
    string public nombreProducto;
    uint public costo;
    bool public enVenta = true;

    //Evento que mostrará el estado de la compra
    event estado(string _msg, address usuario, uint costo, uint tiempo);
    event abortar(string _msg, address usuario, uint costo, uint tiempo);

    //Contiene todas las caracteristicas de la compra
    function comprar(string memory _nombreProducto, uint256 _costo) public {
        require(_costo > 0, "El monto debe ser mayor 0");
        if (enVenta == true) {
            //propietario.transfer address(this).balance;
            // enVenta = false;
            nombreProducto = _nombreProducto;
            costo = _costo;
            propietario = payable(msg.sender);
            //Estado de la compra   
            emit estado("Producto en venta", msg.sender, costo, block.timestamp);
        } else {
            emit estado("Producto no a la venta", msg.sender, costo, block.timestamp);
            //Si no aplica se revierte la compra
            revert();
        }
        tiempoActualizar = block.timestamp;
    }
    //Propietario tiene potestad de actualizar el costo del producto
    function actualizarCosto(uint _costo) public unicoPropietario {
        costo = _costo;
        //Estado de la actualización
        emit estado("Actualizacion del costo", msg.sender, costo, block.timestamp);
    }
    //Propietario tiene potestad de actualizar la descripción del producto
    function modificarDescription(string memory description) public unicoPropietario {
        nombreProducto = description;
        //Estado de la actualización
        emit estado(description, msg.sender, 0, block.timestamp);
        emit estado("Modificacion de descripcion", msg.sender, 0, block.timestamp);
    }
    function abortarCompra(uint coste) payable public unicoPropietario {
        if(msg.value < coste){
            revert();
        }
    }
    //Asignar un producto a la venta
    function ponerVenta() public unicoPropietario {
        enVenta = true;
        emit estado("Producto a la venta", msg.sender, 0, block.timestamp);
    }

    //Abortar un producto de la venta
    function quitarVenta() public unicoPropietario {
        enVenta = true;
        emit estado("Producto no en venta", msg.sender, 0, block.timestamp);
        //propietario.transfer(address(this).balance);
    }
    //Modifica el comportamiento de una función
    modifier unicoPropietario {
        tiempoActualizar = block.timestamp;
        if (msg.sender != propietario) {
            revert();
        } else {
            _;
        }
    }
}