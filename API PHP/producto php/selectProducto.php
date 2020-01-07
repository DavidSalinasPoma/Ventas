<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class SeleccionarProducto
{
    // Atributos de la clase
    public $codigo;

    // Metodo constructor de la clase
    public function __construct($codigo)
    {
        $this->codigo = $codigo;
    }

    // Metodos de comportamiento de clase
    public function selecionarProducto()
    {
        $crear = new Conexion();
        $conn = $crear->conectarDB();

        // Respuestas a la base de datos
        $response = new Result();

        // Validamos que sea un entero
        $idProducto = filter_var($this->codigo, FILTER_SANITIZE_NUMBER_INT);

        try {

            // Para seleccionar un usuario
            $sql = "SELECT * FROM productos WHERE id_producto = $idProducto;";
            $perfil = $conn->query($sql);
            if ($perfil->num_rows) {
                foreach ($perfil as $element) {
                    $lista[] = $element;
                }
                $response->lista = $lista;
            } else {
                $response->vacio = 'No existe este producto.';
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
$lista = new SeleccionarProducto($codigo);

$response = $lista->selecionarProducto();

echo json_encode($response); // conversion a JSON.

header('Content-Type: application/json');
