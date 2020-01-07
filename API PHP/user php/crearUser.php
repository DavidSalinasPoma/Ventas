<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$json = file_get_contents('php://input');

$params = json_decode($json);
// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class CrearUsuario
{
    public $nombre;
    public $pass;
    public $personalId;
    public $perfilId;


    // Metodo constructor
    public function __construct($nombre, $pass, $personalId, $perfilId)
    {
        // Inicializamos varibles
        $this->nombre = $nombre;
        $this->pass = $pass;
        $this->personalId = $personalId;
        $this->perfilId = $perfilId;
    }
    // Metodo INSERTAR PERSONAL
    public function insertarUsuario()
    {
        //Conexion a la base de datos
        $conectar = new Conexion();
        $conn = $conectar->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // Validar que no sea NULL ni vacios
        if (
            $this->nombre === null || $this->pass === null || $this->personalId === null || $this->perfilId === null ||
            $this->nombre === '' || $this->pass === '' || $this->personalId === '' || $this->perfilId === ''
        ) {
            $response->mensaje = 'Los campos con (*) son obligatorios';
        } else {

            // Validar las entradas
            $name = filter_var($this->nombre, FILTER_SANITIZE_STRING);
            $password = filter_var($this->pass, FILTER_SANITIZE_STRING);
            $idPersonal = filter_var($this->personalId, FILTER_SANITIZE_NUMBER_INT);
            $idPerfil = filter_var($this->perfilId, FILTER_SANITIZE_NUMBER_INT);

            /*
        try-catch sirve para que nuestra aplicacion siga funcionando
        en caso de que nuestro servidor se caiga o deje de funcionar
        *Solo se recomienda usarlo en pequeños bloques..ojo
        */
            try {
                // $stmt previene las inyeciones SQL
                $stmt = $conn->prepare("INSERT INTO usuario (nom_usuario, contrasenia, id_personal_p1, id_perfil_p1) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("ssii", $name, $password, $idPersonal, $idPerfil);
                // Ejecutamos el $stmt
                $stmt->execute();

                // Aqui las respuesta a nuestra insercion a la base de datos
                if ($stmt->affected_rows == 1) {
                    $response->resultado = 'OK';
                    $response->mensaje = 'Datos de usuario insertados. Con exito!';
                    // Respondemos el ultimo dato que insertamos
                    $response->datosContacto = [
                        'nombreUsuario' => $name,
                        'password' => $password,
                        'personalId' => $idPersonal,
                        'perfilId' => $idPerfil,
                        'id_usuario' => $stmt->insert_id
                    ];
                    // Cerramos la conexion y $stmt
                    $stmt->close();
                    $conn->close();
                } else {
                    $response->mensaje = 'El nombre de usuario ya existe!';
                    // Cerramos la conexion y $stmt
                    $stmt->close();
                    $conn->close();
                }
            } catch (Exception $e) {
                // Creamos nuestras propias respuestas a la insercionde datos
                $response->error = $e->getMessage();
            }
        }
        return $response;
    }
}

// Creamos contacto


$crear = new CrearUsuario($params->nameUser, $params->pass, $params->personalId, $params->perfilId);
// $crear = new CrearUsuario('DavidSP', '123456', 72, 14);
// $crear = new CrearPerfil('Janet');
// $crear = new Crear('Janet', 'villarroel', 'Ledezama', 6406776, 'Chiñata', '4733282', 'Janet@gmail.com');

$response = $crear->insertarUsuario();

echo json_encode($response);
header('Content-Type: application/json');
