# sites

<!DOCTYPE html>

<html lang="en">

<head>
    <title>Circles colision</title>
    <meta charset="utf-8">
    <!--<meta name="viewport" command="width:device-width, initial-scale=1.0"> -->
    <link rel="stylesheet" href="(https://github.com/Hydan1625/sites/blob/main/colision%20simulator%20v5/texture.css)">
</head>

<body id="body">

    <div class="child">
        <canvas id="canvas"></canvas>
    </div>

    <div class="table">
        <table>
            <div class="td">
                <tr>
                    <td><button id="create_circle">Create<br> a circle</button></td>

                    <td><button id="create_square">Create<br> a square</button></td>

                    <td><button id="create_light">Create<br> a light source</button></td>
                </tr>
                <tr>
                    <td><button id="delete_circle">Delete<br> a circle</button></td>

                    <td><button id="delete_square">Delete<br> a square</button></td>

                    <td><button id="delete_light">Delete a <br>light</button></td>

                </tr>

                <tr>
                    <td><button id="show_circle_line">Show<br> circle line</button></td>

                    <td><button id="show_square_line">Show<br>square line</button></td>

                    <td><button id="show_all_line">Show<br> all line</button></td>

                </tr>

                <tr>
                    <td><button id="create_my_circle">Create my<br> circle</button></td>

                    <td><button id="create_my_square">Create my<br> square</button></td>

                    <td><button id="create_my_light">Create my<br> light</button></td>

                </tr>

                <tr>
                    <td><button id="start">Start the <br>movement</button></td>

                    <td><button id="stop">Stop the <br>movement</button></td>

                    <td><button id="clear_all">Clear the <br>Canvas</button></td>
                </tr>

                <tr>
                    <td><button id="reset_background">Reset the <br>Background</button></td>

                    <td><button id="toggle_shadows">Toggle <br> Shadows</button></td>

                    <td><button id="show_outline">Show the <br> Outline</button></td>
                </tr>

                <tr>
                    <td>
                        <div class="color_container">
                            <input type="color" id="color_value">
                        </div>
                    </td>
                </tr>

            </div>
        </table>



    </div>

    <script src="https://github.com/Hydan1625/sites/blob/main/colision%20simulator%20v5/main.js"></script>
</body>

</html>
