<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class ListarPerfil
{
    // Atributos de la clase

    // Metodo constructor
    public function __construct()
    { }

    // Metodos de comportamiento
    public function listaPerfil()
    {
        $crear = new Conexion();
        $conn = $crear->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        try {
            // Hacer referencia con otras tablas en php
            // $sql = "SEL usuario.id_usuario, usuario.nom_usuario, usuario.contraseña, personal.nombres, personal.ap_paterno, personal.ap_materno, perfil.perfil ";

            $sql = "SELECT usuario.id_usuario, usuario.nom_usuario, usuario.contrasenia, personal.id_personal, personal.nombres, personal.ap_paterno, personal.ap_materno, perfil.id_perfil, perfil.perfil ";
            $sql .= "FROM usuario ";
            $sql .= "INNER JOIN personal ";
            $sql .= "ON usuario.id_personal_p1 = personal.id_personal ";
            $sql .= "INNER JOIN perfil ";
            $sql .= "ON usuario.id_perfil_p1 = perfil.id_perfil ";
            // // Ordenar por id
            $sql .= "ORDER BY id_usuario;";


            // $sql = "SELECT id_usuario FROM usuario";
            // $contactos = mysqli_query($conn, $sql);
            // while ($row = mysqli_fetch_array($contactos)) {
            //     $lista[] = $row;
            // }
            // $response->lista = $lista;
            $usuario = $conn->query($sql);
            if ($usuario->num_rows) {
                foreach ($usuario as $element) {
                    $lista[] = $element;
                }
                $response->lista = $lista;
            } else {

                $response->vacio = 'No existe contacto alguno';
            }
        } catch (Exception $e) {
            echo "error!!!" . $e->getMessage() . '<br>';
            // Retorna false si hubo un error en la consulta
            return false;
        }
        return $response;
    }
}

// instans Object
$lista = new ListarPerfil();

$response = $lista->listaPerfil();

echo json_encode($response); // conversion a JSON.
header('Content-Type: application/json');
