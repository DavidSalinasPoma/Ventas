<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

// Importamos la conexion de forma global
require_once('../conexion.php');
//Importamos clases de resultados
require_once('../result.php');

class ListaProducto
{
    // Atributos de la clase

    // Metodo constructor
    public function __construct()
    {
    }

    // Metodos de comportamiento
    public function producto()
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
            $resultado = $conn->query("SELECT * FROM productos");
            if ($resultado->num_rows) {
                foreach ($resultado as $producto) {
                    // Guardando de aun dato
                    // $lista[] = [
                    //     "id_producto" => $producto['id_producto'],
                    //     "nombre" => $producto['nombre'],
                    //     "cantidad" => $producto['cantidad'],
                    //     "precio" => $producto['precio'],
                    //     "descripcion" => $producto['descripcion'],
                    //     "id_usuario_u1" => $producto['id_usuario_u1']
                    // ];
                    $lista[] = $producto;
                }
                // echo $lista[0];
                $response->lista = $lista;
            } else {
                $response->vacio = 'No existe ningun producto registrados';
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
$lista = new ListaProducto();

$response = $lista->producto();

echo json_encode($response, JSON_UNESCAPED_UNICODE); // conversion a JSON.
// echo json_encode($response); // conversion a JSON.
header('Content-Type: application/json');
