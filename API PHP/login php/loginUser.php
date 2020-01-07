<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class Login
{
    // Atributos de la clase
    public $user;
    public $pass;

    // Metodo constructor de la clase
    public function __construct($user, $pass)
    {
        $this->user = $user;
        $this->pass = $pass;
    }

    // Metodos de comportamiento de clase
    public function buscarUsuario()
    {
        $crear = new Conexion();
        $conn = $crear->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // Validamos que sea un entero
        $usuario = filter_var($this->user, FILTER_SANITIZE_STRING);
        $password = filter_var($this->pass, FILTER_SANITIZE_STRING);

        try {
            $sql = "SELECT * FROM usuario WHERE nom_usuario = \"$usuario\" AND contrasenia = \"$password\"";
            $resultado = $conn->query($sql);
            if ($resultado->num_rows) {
                foreach ($resultado as $element) {
                    $lista[] = $element;
                }
                $response->mensaje = 'ok';
                $response->lista = $lista[0]['id_usuario'];
                // Obtenemos el id del peersonal de este usuario
                $idPersonal = $lista[0]['id_personal_p1'];
                $idPerfil = $lista[0]['id_perfil_p1'];

                // Manda el nombre del usuario al frontend
                $sql2 = "SELECT * FROM personal WHERE id_personal = $idPersonal";
                $resultado2 = $conn->query($sql2);
                foreach ($resultado2 as $dato) {
                    $lista2[] = $dato;
                }
                // Nombre completo
                $nombrePersonal = $lista2[0]['nombres'] . ' ' . $lista2[0]['ap_paterno'];
                $response->usuario = $nombrePersonal;

                // Manda el nombre del cargo del usuario
                $sql3 = "SELECT * FROM perfil WHERE id_perfil = $idPerfil";
                $resultado3 = $conn->query($sql3);
                foreach ($resultado3 as $datoPerfil) {
                    $lista3[] = $datoPerfil;
                }
                $response->perfil = $lista3[0]['perfil'];

                //*********IMPORTANTE******** */
                // agregando sessiones a Amalia SRL.
                // Iniciando la sesion para el login
                // session_start();
                // Grabando datos para la sesión
                // $_SESSION['id_admin'] = $lista[0]['id_usuario'];
                // $_SESSION['nombre_admin'] = $nombrePersonal;
                // $_SESSION['perfil_admin'] = $lista3[0]['perfil'];
            } else {
                $response->mensaje = 'Usuario ó contraseña incorrectos..';
            }
        } catch (Exception $e) {
            // echo "error!!!" . $e->getMessage() . '<br>';
            $response->mensaje = $e->getMessage();
        }
        return $response;
    }
}

// Aqui se recibe  por metodo get
$usuario = $_GET['usuario'];
$password = $_GET['password'];
// instans Object
$lista = new Login($usuario, $password);
// $lista = new Login('zzz', 'zzz');

$response = $lista->buscarUsuario();

echo json_encode($response); // conversion a JSON.

header('Content-Type: application/json');
