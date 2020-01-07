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

class ModificarUsuario
{
    // Atributos de la clase
    public $idPersonalUser;
    public $idPerfilUser;
    public $nameUser;
    public $passUser;
    public $idUsuario;
    // Metodo constructor
    public function __construct($idPersonal, $idPerfil, $nombreUser, $passwordUser, $usuarioId)
    {
        // Inicializamos varibles
        $this->idUsuario = $usuarioId;
        $this->idPersonalUser = $idPersonal;
        $this->idPerfilUser = $idPerfil;
        $this->nameUser = $nombreUser;
        $this->passUser = $passwordUser;
    }

    // Metodo INSERTAR PERSONAL
    public function actualizarUsuario()
    {
        //Conexion a la base de datos
        $conectar = new Conexion();
        $conn = $conectar->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // // Validar que no sea NULL ni vacios
        if (
            $this->nameUser == null || $this->passUser == null || $this->idPersonalUser == null || $this->idPerfilUser == null ||
            $this->nameUser == '' || $this->passUser == '' || $this->idPersonalUser == '' || $this->idPerfilUser == ''
        ) {
            $response->mensaje = 'Los campos con (*) son obligatorios';
        } else {
            // Validar las entradas
            $idUser = filter_var($this->idUsuario, FILTER_SANITIZE_NUMBER_INT);
            $idUserPersonal = filter_var($this->idPersonalUser, FILTER_SANITIZE_NUMBER_INT);
            $idUserPerfil = filter_var($this->idPerfilUser, FILTER_SANITIZE_NUMBER_INT);
            $nombreUsuario = filter_var($this->nameUser, FILTER_SANITIZE_STRING);
            $passUsuario = filter_var($this->passUser, FILTER_SANITIZE_STRING);
            /*
              try-catch sirve para que nuestra aplicacion siga funcionando
              en caso de que nuestro servidor se caiga o deje de funcionar
              *Solo se recomienda usarlo en pequeños bloques..ojo
            */
            // Verificamos si la consulta se realizo correctamente
            try {
                // Forma de revisar un UPDATE con prepare statement
                $stmt = $conn->prepare("UPDATE usuario SET nom_usuario=?, contrasenia=?, id_personal_p1=?, id_perfil_p1=? WHERE id_usuario=?");
                $stmt->bind_param("ssiii", $nombreUsuario, $passUsuario, $idUserPersonal, $idUserPerfil, $idUser);
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
$actualizar = new ModificarUsuario($params->idPersonal, $params->idPerfil, $params->nameUser, $params->passUser, $params->idUsuario);
// $actualizar = new ModificarUsuario(70, 10, '', 'David Salinas Poma', 'salinas', 38);

$response = $actualizar->actualizarUsuario();
echo json_encode($response);
header('Content-Type: application/json');
