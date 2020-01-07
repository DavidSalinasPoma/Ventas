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

class ModificarPersonal
{
    // Atributos de la clase
    public $idPersonal;
    public $nombres;
    public $paterno;
    public $materno;
    public $carnet;
    public $direccion;
    public $telefono;
    public $email;

    // Metodo constructor
    public function __construct($idPersonal, $nombres, $paterno, $materno, $carnet, $direccion, $telefono, $email)
    {
        // Inicializamos varibles
        $this->idPersonal = $idPersonal;
        $this->nombres = $nombres;
        $this->paterno = $paterno;
        $this->materno = $materno;
        $this->carnet = $carnet;
        $this->direccion = $direccion;
        $this->telefono = $telefono;
        $this->email = $email;
    }

    // Metodo INSERTAR PERSONAL
    public function actualizarPersonal()
    {
        //Conexion a la base de datos
        $conectar = new Conexion();
        $conn = $conectar->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // // Validar que no sea NULL ni vacios
        if (
            $this->nombres === null || $this->paterno === null || $this->carnet === null || $this->direccion === null ||
            $this->nombres === '' || $this->paterno === '' || $this->carnet === '' || $this->direccion === ''
        ) {
            $response->mensaje = 'Los campos con (*) son obligatorios';
        } else {
            // Validar las entradas
            $idPersonal = filter_var($this->idPersonal, FILTER_SANITIZE_NUMBER_INT);
            $nombres = filter_var($this->nombres, FILTER_SANITIZE_STRING);
            $paterno = filter_var($this->paterno, FILTER_SANITIZE_STRING);
            $materno = filter_var($this->materno, FILTER_SANITIZE_STRING);
            $carnet = filter_var($this->carnet, FILTER_SANITIZE_NUMBER_INT);
            $direccion = filter_var($this->direccion, FILTER_SANITIZE_STRING);
            $telefono = filter_var($this->telefono, FILTER_SANITIZE_STRING);
            $email = filter_var($this->email, FILTER_SANITIZE_STRING);
            /*
              try-catch sirve para que nuestra aplicacion siga funcionando
              en caso de que nuestro servidor se caiga o deje de funcionar
              *Solo se recomienda usarlo en pequeños bloques..ojo
            */
            // Verificamos si la consulta se realizo correctamente
            try {
                // Forma de revisar un UPDATE con prepare statement
                $stmt = $conn->prepare("UPDATE personal SET c_identidad=?, nombres=?, ap_paterno=?, ap_materno=?, direccion=?, telefono=?, email=? WHERE id_personal=?");
                $stmt->bind_param("issssssi", $carnet, $nombres, $paterno, $materno, $direccion, $telefono, $email, $idPersonal);
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
            return $response;
        }
    }
}


// Creamos contacto
// echo gettype($params->nombress);
$actualizar = new ModificarPersonal($params->idPersonal, $params->nombress, $params->paterno, $params->materno, $params->carnet, $params->direccion, $params->telefono, $params->email);
// $actualizar = new ModificarPersonal(70, 'Jonas', 'villarroel', 'Zara', 6406776, 'Chiñata', '4733282', 'Janet@gmail.com');

$response = $actualizar->actualizarPersonal();
echo json_encode($response);
header('Content-Type: application/json');
