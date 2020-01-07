<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$json = file_get_contents('php://input');

$params = json_decode($json);
// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class CrearPerfil
{
    public $perfil;


    // Metodo constructor
    public function __construct($perfil)
    {
        // Inicializamos varibles
        $this->perfil = $perfil;
    }
    // Metodo INSERTAR PERSONAL
    public function insertarPerfil()
    {

        //Conexion a la base de datos
        $conectar = new Conexion();
        $conn = $conectar->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // Validar las entradas
        $perfil = filter_var($this->perfil, FILTER_SANITIZE_STRING);

        /*
        try-catch sirve para que nuestra aplicacion siga funcionando
        en caso de que nuestro servidor se caiga o deje de funcionar
        *Solo se recomienda usarlo en pequeños bloques..ojo
        */
        try {
            // $stmt previene las inyeciones SQL
            $stmt = $conn->prepare("INSERT INTO perfil (perfil) VALUES (?)");
            $stmt->bind_param("s", $perfil);
            // Ejecutamos el $stmt
            $stmt->execute();

            // Aqui las respuesta a nuestra insercion a la base de datos
            if ($stmt->affected_rows == 1) {
                $response->resultado = 'OK';
                $response->mensaje = 'Datos insertados. Con exito!';
                // Respondemos el ultimo dato que insertamos
                $response->datosContacto = [
                    'perfil' => $perfil,
                    'id_perfil' => $stmt->insert_id
                ];
                // Cerramos la conexion y $stmt
                $stmt->close();
                $conn->close();
            } else {
                $response->mensaje = 'Datos no grabados';
                // Cerramos la conexion y $stmt
                $stmt->close();
                $conn->close();
            }
        } catch (Exception $e) {
            // Creamos nuestras propias respuestas a la insercionde datos
            $response->error = $e->getMessage();
        }
        return $response;
    }
}

// Creamos contacto
$crear = new CrearPerfil($params->perfil);
// $crear = new CrearPerfil('Janet');
// $crear = new Crear('Janet', 'villarroel', 'Ledezama', 6406776, 'Chiñata', '4733282', 'Janet@gmail.com');

$response = $crear->insertarPerfil();

echo json_encode($response);
header('Content-Type: application/json');