<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class EliminarPerfil
{
    public $codigo;
    // Metodo constructor
    public function __construct($codigo)
    {
        $this->codigo = $codigo;
    }
    // metodos
    public function eliminarPerfil()
    {
        //Conexion a la base de datos
        $conectar = new Conexion();
        $conn = $conectar->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // Validamos que sea un entero
        $id = filter_var($this->codigo, FILTER_SANITIZE_NUMBER_INT);

        try {
            $stmt = $conn->prepare("DELETE FROM perfil WHERE id_perfil = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            if ($stmt->affected_rows == 1) {
                $response->respuesta = 'correcto';
            } else {
                $response->respuesta = 'No existe';
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            $response->error = $e->getMessage();
        }
        return $response;
    }
}
// INSTANCE object EliminarPersonal 
$id_perfil = $_GET['codigo'];
// $id_personal = 20;

$personal = new EliminarPerfil($id_perfil);
$response = $personal->eliminarPerfil();

echo json_encode($response);
header('Content-Type: application/json');