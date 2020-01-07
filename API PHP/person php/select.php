<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class Seleccionar
{
    // Atributos de la clase
    public $codigo;
    // Metodo constructor de la clase
    public function __construct($codigo)
    {
        $this->codigo = $codigo;
    }

    // Metodos de comportamiento de clase
    public function selecionarPersonal()
    {
        $crear = new Conexion();
        $conn = $crear->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // Validamos que sea un entero
        $id = filter_var($this->codigo, FILTER_SANITIZE_NUMBER_INT);

        try {
            // Aqui se recibe los datos por metodo get
            $contactos = $conn->query("SELECT * FROM personal WHERE id_personal = $id");
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

$codigo = $_GET['codigo'];
// instans Object
$lista = new Seleccionar($codigo);

$response = $lista->selecionarPersonal();

echo json_encode($response); // conversion a JSON.

header('Content-Type: application/json');
