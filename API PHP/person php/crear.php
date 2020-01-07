<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$json = file_get_contents('php://input');

$params = json_decode($json);

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class Crear
{
    public $nombre;
    public $paterno;
    public $materno;
    public $carnet;
    public $direccion;
    public $telefono;
    public $email;


    // Metodo constructor
    public function __construct($nombre, $paterno, $materno, $carnet, $direccion, $telefono, $email)
    {
        // Inicializamos varibles
        $this->nombre = $nombre;
        $this->paterno = $paterno;
        $this->materno = $materno;
        $this->carnet = $carnet;
        $this->direccion = $direccion;
        $this->telefono = $telefono;
        $this->email = $email;
    }

    // Metodo INSERTAR PERSONAL
    public function insertarPersonal()
    {
        //Conexion a la base de datos
        $conectar = new Conexion();
        $conn = $conectar->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // Validar que no sea NULL ni vacios
        if (
            $this->nombre === null || $this->paterno === null || $this->carnet === null || $this->direccion === null ||
            $this->nombre === '' || $this->paterno === '' || $this->carnet === '' || $this->direccion === ''
        ) {
            $response->mensaje = 'Los campos con (*) son obligatorios';
        } else {
            $response->mensaje = 'No pasa nada';
            // Validar las entradas
            $nombre = filter_var($this->nombre, FILTER_SANITIZE_STRING);
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
            try {
                // $stmt previene las inyeciones SQL
                $stmt = $conn->prepare("INSERT INTO personal (c_identidad, nombres, ap_paterno, ap_materno, direccion, telefono, email) VALUES (?,?,?,?,?,?,?)");
                $stmt->bind_param("issssss", $carnet, $nombre, $paterno, $materno, $direccion, $telefono, $email);
                // Ejecutamos el $stmt
                $stmt->execute();

                // Aqui las respuesta a nuestra insercion a la base de datos
                if ($stmt->affected_rows == 1) {
                    $response->resultado = 'OK';
                    $response->mensaje = 'Datos insertados. Con exito!';
                    // Respondemos el ultimo dato que insertamos
                    $response->datosContacto = [
                        'nombres' => $nombre,
                        'ap_paterno' => $paterno,
                        'ap_materno' => $materno,
                        'c_identidad' => $carnet,
                        'direccion' => $direccion,
                        'telefono' => $telefono,
                        'email' => $email,
                        'id_personal' => $stmt->insert_id
                    ];
                    // Cerramos la conexion y $stmt
                    $stmt->close();
                    $conn->close();
                } else {
                    $response->mensaje = '!El numero de carnet ya existe!';
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
$crear = new Crear($params->nombress, $params->paterno, $params->materno, $params->carnet, $params->direccion, $params->telefono, $params->email);
// $crear = new Crear('Ana', 'villarroel', 'Ledezama', 6406776, 'Chiñata', '4733282', 'Janet@gmail.com');

$response = $crear->insertarPersonal();

echo json_encode($response);
header('Content-Type: application/json');
