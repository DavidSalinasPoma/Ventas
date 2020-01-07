<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
// Recibiendo datos desde el frontend
$json = file_get_contents('php://input');

$params = json_decode($json);
// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class ModificarPerfil
{
    // Atributos de la clase
    public $idPerfil;
    public $perfil;
    // Metodo constructor de la clase
    public function __construct($idPerfil, $perfil)
    {
        $this->idPerfil = $idPerfil;
        $this->perfil = $perfil;

        // Inicializando la conexion a la base de datos
        $this->crear = new Conexion();
        // Respuestas a la base de datos
        $this->response = new Result();
    }

    // Metodos de comportamiento de la clase
    public function actualizarPerfil()
    {
        // Creamos la conexion
        $conn = $this->crear->conectarDB();

        // Verificamos si la consulta se realizo correctamente
        try {
            // Forma de revisar un UPDATE con prepare statement
            $stmt = $conn->prepare("UPDATE perfil SET perfil=? WHERE id_perfil=?");
            $stmt->bind_param("si", $this->perfil, $this->idPerfil);
            // Ejecutamos el statement
            $stmt->execute();

            // Mensajes de modificacion para el frontend
            // Verificamos si alguna fila a sido afectada
            if ($stmt->affected_rows == 1) {
                $this->response->respuesta = 'correcto';
            } else {
                $this->response->respuesta = 'error';
            }


            // Luego cerramos el $stmt y $conn
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            $this->response->respuesta = $e->getMessage() + 'error detectado';
        }
        return $this->response;
    }
}
// Datos que se recibe del frontend para modificar
$crear = new ModificarPerfil($params->idPerfil, $params->perfil);
// $crear = new ModificarPerfil(16, 'adminnf');
// $crear = new ModificarPersonal(55, 'Janet', 'villarroel', 'Ledezama', 6406776, 'Chiñata', '4733282', 'Janet@gmail.com');

$response = $crear->actualizarPerfil();

echo json_encode($response);
header('Content-Type: application/json');