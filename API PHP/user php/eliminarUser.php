<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class EliminarUsuario
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
        $id = filter_var($this->codigo, FILTER_SANITIZE_NUMBER_INT);

        try {
            $stmt = $conn->prepare("DELETE FROM usuario where id_usuario = ?");
            $stmt->bind_param("i", $id);
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
// INSTANCE object EliminarUsuario
$idUsuario = $_GET['codigo'];
// $id_personal = 72;

$usuario = new EliminarUsuario($idUsuario);
$response = $usuario->eliminar();

echo json_encode($response);
header('Content-Type: application/json');
