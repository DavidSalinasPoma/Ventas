<?php
class Conexion
{
    // Credenciales de la base de datos
    // Las definimos como contantes
    public  $usuario;
    public  $password;
    public  $host;
    public  $nombreBD;
    // public $puestoMysql;

    // Constructor
    public function __construct()
    {
        // Aqui inicializamos las varibles
        $this->usuario = 'root';
        $this->password = '';
        $this->host = 'localhost';
        $this->nombreBD = 'amaliabdproduccion';
        // $this->puertoMysql = '3306';

    }
    public function conectarDB()
    {
        // El quinto parametro es el puerto donde esta corriendo mysql y se pone al final
        // $conn = new mysqli($this->host, $this->usuario, $this->password, $this->nombreBD,$this->puertoMysql);
        $conn = new mysqli($this->host, $this->usuario, $this->password, $this->nombreBD);
        // Para insertar con ñ y acentos en la base de datos.
        $conn->set_charset('utf8');
        return $conn;
    }
}
// PRUEBAS DE CONEXIÓN

$crear = new Conexion();
$conn = $crear->conectarDB();

// IMPRIME 1 SI LA CONEXION SALIO BIEN

// echo $conn->ping();
