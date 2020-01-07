<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$json = file_get_contents('php://input');

$params = json_decode($json);

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

$response = new Result();

class ModificarProducto
{
    // Atributos de la clase
    public $idProducto;
    public $nameProducto;
    public $precio;
    public $cantidad;
    public $descripcion;
    public $idUsuario;
    // Metodo constructor
    public function __construct($idProducto, $nameProducto, $cantidad, $precio, $descripcion, $idUsuario)
    {
        // Inicializamos varibles
        $this->idProducto = $idProducto;
        $this->nameProducto = $nameProducto;
        $this->precio = $precio;
        $this->cantidad = $cantidad;
        $this->descripcion = $descripcion;
        $this->idUsuario = $idUsuario;
    }

    // Metodo INSERTAR PERSONAL
    public function actualizarProducto()
    {
        //Conexion a la base de datos
        $conectar = new Conexion();
        $conn = $conectar->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // // Validar que no sea NULL ni vacios
        if (
            $this->nameProducto == null || $this->cantidad == null || $this->descripcion == null || $this->idUsuario == null || $this->precio == null ||
            $this->nameProducto == '' || $this->cantidad == '' || $this->descripcion == '' || $this->idUsuario == '' || $this->precio == ''
        ) {
            $response->mensaje = 'Los campos con (*) son obligatorios';
        } else {
            // Validar las entradas
            $idProducto = filter_var($this->idProducto, FILTER_SANITIZE_NUMBER_INT);
            $nameProducto = filter_var($this->nameProducto, FILTER_SANITIZE_STRING);
            $precio = filter_var($this->precio, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
            $cantidad = filter_var($this->cantidad, FILTER_SANITIZE_NUMBER_INT);
            $descripcion = filter_var($this->descripcion, FILTER_SANITIZE_STRING);
            $idUsuario = filter_var($this->idUsuario, FILTER_SANITIZE_NUMBER_INT);
            /*
              try-catch sirve para que nuestra aplicacion siga funcionando
              en caso de que nuestro servidor se caiga o deje de funcionar
              *Solo se recomienda usarlo en pequeños bloques..ojo
            */
            // Verificamos si la consulta se realizo correctamente
            try {
                // Forma de revisar un UPDATE con prepare statement
                $stmt = $conn->prepare("UPDATE productos SET nombre=?, cantidad=?, precio=?, descripcion=?, id_usuario_u1=? WHERE id_producto=?");
                $stmt->bind_param("sidsii", $nameProducto, $cantidad, $precio, $descripcion, $idUsuario, $idProducto);
                // Ejecutamos el statement
                $stmt->execute();
                // Mensajes de modificacion para el frontend
                // Verificamos si alguna fila a sido afectada
                if ($stmt->affected_rows == 1) {
                    $response->mensaje = 'correcto';
                } else {
                    $response->mensaje = 'No se Modificó ningun Campo!!';
                }
                // Luego cerramos el $stmt y $conn
                $stmt->close();
                $conn->close();
            } catch (Exception $e) {
                $response->mensaje = $e->getMessage() + ' Error detectado';
            }
        }
        return $response;
    }
}


// Creamos contacto
// echo gettype($params->nombress);
$actualizar = new ModificarProducto($params->idProducto, $params->producto, $params->cantidad, $params->precio, $params->descripcion, $params->idUsuario);
// $actualizar = new ModificarProducto(31, 'Naranjas', 25, 3.125, 'Naranjas del Chapare de buena calidad', 177);

$response = $actualizar->actualizarProducto();
echo json_encode($response);
header('Content-Type: application/json');
