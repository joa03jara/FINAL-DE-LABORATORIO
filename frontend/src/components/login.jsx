import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import "../css/login.css";

function Login() {
    const [limpiar, setLimpiar] = useState(false);

    const usuarioRef = useRef(null);
    const contraseñaRef = useRef(null);

    useEffect(() => {
        if (limpiar) {
            limpiarCampos();
            setLimpiar(false);
        }
    }, [limpiar]);

    const limpiarCampos = () => {
        if (usuarioRef.current) usuarioRef.current.value = "";
        if (contraseñaRef.current) contraseñaRef.current.value = "";
    };

    const navigate = useNavigate();

    const obtenerUsuario = async () => {
        const usuario = usuarioRef.current.value;
        const contraseña = contraseñaRef.current.value;

        try {
            const response = await axios.post("http://localhost:5000/getUsuario", {
                usuario,
                contraseña
            });

            const datos = response.data;

            if (datos !== "") {
                alert("Bienvenido");
                navigate('/lib');
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Usuario o Contraseña Incorrecta");
            setLimpiar(true);
        }
    };

    ////////////////////////////////---PUT-CONTRSEÑA---//////////////////////////////////

    const actualizarContraseña = async () => {
        const usuario = usuarioRef.current.value;
        const contraseña = contraseñaRef.current.value;

        try {
            const response = await axios.put("http://localhost:5000/putUsuario", {
                usuario,
                contraseña
            });

            const datos = response.data;

            if (datos) {
                alert("Contraseña Actualizada");
            }
        } catch {
            alert("1) Para cambiar la contraseña de su cuenta es necesario poner el mismo Usuario");
            alert("2) Luego escribir en el campo Contraseña la nueva clave");
            alert("3) Por ultimo le da click en cambiar contrseña y asi se actualizara");
        }
    };

    return (
        <div className="class-login">
            <h2>Iniciar Sesion</h2>
            <input id="id-usuario-login" type="text" placeholder="Usuario" ref={usuarioRef} required />
            <input id="id-password-login" type="password" placeholder="Contraseña" ref={contraseñaRef} required />
            <input type="submit" value="Ingresar" onClick={obtenerUsuario} />
            <a href="#" onClick={actualizarContraseña}>Cambiar Contraseña</a>
            <Link to="/reg">Registrarse</Link>
        </div>
    );
}

export default Login;
