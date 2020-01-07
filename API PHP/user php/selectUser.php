<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class SeleccionarUsuario
{
    // Atributos de la clase
    public $codigo;

    // Metodo constructor de la clase
    public function __construct($codigo)
    {
        $this->codigo = $codigo;
    }

    // Metodos de comportamiento de clase
    public function selecionarUsuario()
    {
        $crear = new Conexion();
        $conn = $crear->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // Validamos que sea un entero
        $id = filter_var($this->codigo, FILTER_SANITIZE_NUMBER_INT);

        try {

            // Para seleccionar un usuario
            $sql = "SELECT usuario.id_usuario, usuario.nom_usuario, usuario.contrasenia, personal.id_personal, personal.nombres, personal.ap_paterno, personal.ap_materno, perfil.id_perfil, perfil.perfil ";
            $sql .= "FROM usuario ";
            $sql .= "INNER JOIN personal ";
            $sql .= "ON usuario.id_personal_p1 = personal.id_personal ";
            $sql .= "INNER JOIN perfil ";
            $sql .= "ON usuario.id_perfil_p1 = perfil.id_perfil ";
            // // Ordenar por id
            $sql .= "WHERE id_usuario = $id";

            $perfil = $conn->query($sql);
            if ($perfil->num_rows) {
                foreach ($perfil as $element) {
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

// Aqui se recibe  por metodo get
$codigo = $_GET['codigo'];
// instans Object
$lista = new SeleccionarUsuario($codigo);

$response = $lista->selecionarUsuario();

echo json_encode($response); // conversion a JSON.

header('Content-Type: application/json');
