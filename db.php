<?php

$servername = "localhost";
$username = "root";
$pwd = "";
$dbname = "my_utils";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $pwd);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "PDO : Connection failed: " . $e->getMessage() . "\n";
}

if (isset($_GET["function"])) {
    if ($_GET["function"] == "add") {
        $var = [];
        $input = json_decode(file_get_contents('php://input'), true);
        if ($input) {
            foreach ($input as $key => $value) {
                array_push($var, $value);
            }
        }
        $content = $var[0];
        $type = $var[1];
        $sql = "INSERT INTO `list` (`id`, `body`, `type`) VALUES (NULL, :content, :type)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':type', $type);
        if ($stmt->execute()) {
            echo "true";
        } else {
            echo "false";
        }
    } elseif ($_GET["function"] == "rm") {
        $sql = "DELETE FROM list";
        $stmt = $conn->prepare($sql);
        if ($stmt->execute()) {
            echo "true";
        } else {
            echo "false";
        }
    } elseif ($_GET["function"] == "load") {
        $sql = "SELECT * FROM `list`";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll();
        $result = json_encode($result);
        echo($result);
    }
}
