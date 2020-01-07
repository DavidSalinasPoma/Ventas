<?php

header('Access-Control-Allow-Origin: *');
header("content-Type: text/html;charset=utf-8");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$json = file_get_contents('php://input');

$params = json_decode($json);

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class Producto
{
    public $producto;
    public $cantidad;
    public $precio;
    public $descripcion;
    public $idUsuario;

    // Metodo constructor
    public function __construct($producto, $cantidad, $precio, $descripcion, $usuario)
    {
        // Inicializamos varibles
        $this->producto = $producto;
        $this->cantidad = $cantidad;
        $this->precio = $precio;
        $this->descripcion = $descripcion;
        $this->idUsuario = $usuario;
    }

    // Metodo INSERTAR PERSONAL
    public function insertarProducto()
    {
        //Conexion a la base de datos
        $conectar = new Conexion();
        $conn = $conectar->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // Validar que no sea NULL ni vacios
        if (
            $this->producto === null || $this->cantidad === null || $this->precio === null || $this->descripcion === null || $this->idUsuario === null ||
            $this->producto === '' || $this->cantidad === '' || $this->precio === '' || $this->descripcion === '' || $this->idUsuario === ''
        ) {
            $response->mensaje = 'Los campos con (*) son obligatorios';
        } else {
            // Validar las entradas
            $producto = filter_var($this->producto, FILTER_SANITIZE_STRING);
            $cantidad = filter_var($this->cantidad, FILTER_SANITIZE_NUMBER_INT);
            $precio = filter_var($this->precio, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
            $descripcion = filter_var($this->descripcion, FILTER_SANITIZE_STRING);
            $idUsuario = filter_var($this->idUsuario, FILTER_SANITIZE_NUMBER_INT);
            /*
              try-catch sirve para que nuestra aplicacion siga funcionando
              en caso de que nuestro servidor se caiga o deje de funcionar
              *Solo se recomienda usarlo en pequeños bloques..ojo
            */

            try {
                // $stmt previene las inyeciones SQL
                $stmt = $conn->prepare("INSERT INTO productos (nombre, cantidad, precio, descripcion, id_usuario_u1) VALUES (?,?,?,?,?)");
                $stmt->bind_param("sidsi", $producto, $cantidad, $precio, $descripcion, $idUsuario);
                // Ejecutamos el $stmt
                $stmt->execute();

                // Aqui las respuesta a nuestra insercion a la base de datos
                if ($stmt->affected_rows == 1) {
                    $response->resultado = 'OK';
                    $response->mensaje = 'Datos insertados. Con exito!';
                    // Respondemos el ultimo dato que insertamos
                    $response->datosContacto = [
                        'nombre' => $producto,
                        'cantidad' => $cantidad,
                        'precio' => $precio,
                        'descripcion' => $descripcion,
                        'id_usuario_u1' => $idUsuario,
                        'id_producto' => $stmt->insert_id
                    ];
                    // Cerramos la conexion y $stmt
                    $stmt->close();
                    $conn->close();
                } else {
                    $response->mensaje = 'El nombre del producto ya esta registrado!';
                    // Cerramos la conexion y $stmt
                    $stmt->close();
                    $conn->close();
                }
            } catch (Exception $e) {
                // Creamos nuestras propias respuestas a la insercionde datos
                $response->mensaje = $e->getMessage();
            }
        }
        return $response;
    }
}

// Creamos contacto
// echo gettype($params->nombress);
$crear = new Producto($params->producto, $params->cantidad, $params->precio, $params->descripcion, $params->idUsuario);
// $crear = new Producto('núñez', 50, 1.2, 'comunicación', 177);

$response = $crear->insertarProducto();

echo json_encode($response);
header('Content-Type: application/json');
