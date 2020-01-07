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
            // $registros = mysqli_query($conn, "SELECT * FROM personal");
            // while ($reg = mysqli_fetch_array($registros)) {
            //     $response->vec[] = $reg;
            // }
            $contactos = $conn->query("SELECT * FROM perfil");
            if ($contactos->num_rows) {
                foreach ($contactos as $contacto) {
                    $lista[] = $contacto;
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
