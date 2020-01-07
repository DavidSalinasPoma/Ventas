<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class EliminarProducto
{
    public $codigo;
    // Metodo constructor
    public function __construct($codigo)
    {
        $this->codigo = $codigo;
    }
    // metodos
    public function eliminar()
    {
        //Conexion a la base de datos
        $conectar = new Conexion();
        $conn = $conectar->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // Validamos que sea un entero
        $idProducto = filter_var($this->codigo, FILTER_SANITIZE_NUMBER_INT);

        try {
            $stmt = $conn->prepare("DELETE FROM productos where id_producto = ?");
            $stmt->bind_param("i", $idProducto);
            $stmt->execute();
            if ($stmt->affected_rows == 1) {
                $response->mensaje = 'correcto';
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            $response->mensaje = $e->getMessage();
        }
        return $response;
    }
}
// INSTANCE object EliminarProducto
$id_producto = $_GET['codigo'];
// $id_producto = 32;

$producto = new EliminarProducto($id_producto);
$response = $producto->eliminar();

echo json_encode($response);
header('Content-Type: application/json');
