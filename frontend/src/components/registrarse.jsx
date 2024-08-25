import React, { useEffect,useState } from "react";
import axios from "axios"
import "../css/registrarse.css";
import { Navigate, useNavigate } from "react-router-dom";

function Registrarse() {

    const navegate = useNavigate();

    const [limpiar, setLimpiar] = useState(false);

        useEffect(() => {
            if (limpiar) {
                limpiarCampos();
                setLimpiar(false);
            }
        }, [limpiar]);

    const limpiarCampos = () => {
        document.getElementById("id-nombre-registro").value = "";
        document.getElementById("id-apellido-registro").value = "";
        document.getElementById("id-usuario-registro").value = "";
        document.getElementById("id-email-registro").value = "";
        document.getElementById("id-password-registro").value = "";
    };

     ////////////////////////////////---POST---//////////////////////////////////
     
    const guardarRegistro = () => {
        const gNombre = document.getElementById("id-nombre-registro").value;
        const gApellido = document.getElementById("id-apellido-registro").value;
        const gUsuario = document.getElementById("id-usuario-registro").value;
        const gEmail = document.getElementById("id-email-registro").value;
        const gPassword = document.getElementById("id-password-registro").value;
        
        if(gNombre != "" && gApellido != "" && gUsuario != "" && gEmail != "" && gPassword != "") {
            axios.post("http://localhost:5000/postUsuario", {
                
                name: gNombre,
                lastname: gApellido,
                user: gUsuario,
                email: gEmail,
                password: gPassword
            });
            alert("Su cuenta se a creado con exito");
            navegate("/");
            setLimpiar(true);
        }
        else {
            alert("Asegurese de llenar todos los campos requeridos (*)");
            setLimpiar(true);
        }
    }

    return (
        <>
        <div className="registrarse">
            <h2>Crear una Cuenta</h2>
                <input id="id-nombre-registro" type="text" placeholder="Nombre" required/>
                <input id="id-apellido-registro" type="text" placeholder="Apellido" required/>
                <input id="id-usuario-registro" type="text" placeholder="Usuario" required/>
                <input id="id-email-registro" type="email" placeholder="Email" required/>
                <input id="id-password-registro" type="password" placeholder="Contraseña" required/>

                <input type="submit" value="Crear una Cuenta"onClick={guardarRegistro}/>
        </div>
        </>
    )
}




//    

   

// }



   

       


       

       
    
   


export default Registrarse;