import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../css/libros.css";

function Libros() {
    const [limpiar, setLimpiar] = useState(false);
    const [librosRegistrados, setLibrosRegistrados] = useState([]);
    const [totalLibros, setTotalLibros] = useState(0);

    const tituloRef = useRef(null);
    const autorRef = useRef(null);
    const generoRef = useRef(null);
    const fechaRef = useRef(null);
    const precioRef = useRef(null);

    useEffect(() => {
        // Inicializa el conteo de libros registrados al cargar el componente
        const obtenerLibrosRegistrados = async () => {
            try {
                const response = await axios.get("http://localhost:5000/getLibrosRegistrados");
                setLibrosRegistrados(response.data);
                setTotalLibros(response.data.length);
            } catch (error) {
                console.error("Error al obtener los libros registrados:", error);
            }
        };

        obtenerLibrosRegistrados();
    }, []);

    const validarCamposFechaPrecio = () => {
        const fechaActual = new Date();
        const fechaLibro = new Date(fechaRef.current.value);

        if (fechaLibro > fechaActual) {
            setLimpiar(true);
            throw new Error('La Fecha no puede ser futura a la actual');
        }

        if (precioRef.current.value < 0) {
            setLimpiar(true);
            throw new Error('El precio no puede ser negativo');
        }
    };

    useEffect(() => {
        if (limpiar) {
            limpiarCampos();
            setLimpiar(false);
        }
    }, [limpiar]);

    const limpiarCampos = () => {
        tituloRef.current.value = "";
        autorRef.current.value = "";
        generoRef.current.value = "";
        fechaRef.current.value = "";
        precioRef.current.value = "";
    };

    const guardarLibro = () => {
        if (totalLibros >= 3) {
            alert("No puedes registrar más de 3 libros.");
            setLimpiar(true);
            return;
        }

        try {
            validarCamposFechaPrecio();
        } catch (e) {
            alert(e.message);
            return;
        }

        const gTitulo = tituloRef.current.value;
        const gAutor = autorRef.current.value;
        const gGenero = generoRef.current.value;
        const gFecha = fechaRef.current.value;
        const gPrecio = precioRef.current.value;

        if (gTitulo !== "" && gAutor !== "" && gGenero !== "" && gFecha !== "" && gPrecio !== "") {
            axios.post("http://localhost:5000/postLibro", {
                title: gTitulo,
                author: gAutor,
                gender: gGenero,
                date: gFecha,
                price: gPrecio
            }).then((response) => {
                setLibrosRegistrados([...librosRegistrados, response.data]);
                setTotalLibros(totalLibros + 1);
                alert("Su libro se ha guardado con éxito");
                setLimpiar(true);
            }).catch(error => {
                console.error("Error al guardar el libro:", error);
                alert("Error al guardar el libro.");
            });
        } else {
            alert("Es necesario que llene todos los campos");
            setLimpiar(true);
        }
    };

    const actualizarLibro = async () => {
        try {
            validarCamposFechaPrecio();
        } catch (e) {
            alert(e.message);
            return;
        }

        const aTitulo = tituloRef.current.value;
        const aAutor = autorRef.current.value;
        const aGenero = generoRef.current.value;
        const aFecha = fechaRef.current.value;
        const aPrecio = precioRef.current.value;

        try {
            const response = await axios.put("http://localhost:5000/putLibro", {
                aTitulo,
                aAutor,
                aGenero,
                aFecha,
                aPrecio
            });

            const datos = response.data;

            if (datos) {
                setLibrosRegistrados(librosRegistrados.map(libro =>
                    libro.title === aTitulo ? { ...libro, author: aAutor, gender: aGenero, date: aFecha, price: aPrecio } : libro
                ));
                alert("Libro Actualizado con éxito");
                setLimpiar(true);
            }
        } catch {
            alert("El libro seleccionado no existe en nuestra Biblioteca");
            setLimpiar(true);
        }
    };

    const borrarLibro = async () => {
        const aTitulo = tituloRef.current.value;

        try {
            const response = await axios.post("http://localhost:5000/deleteLibro", {
                aTitulo
            });

            const datos = response.data;

            if (datos) {
                setLibrosRegistrados(librosRegistrados.filter(libro => libro.title !== aTitulo));
                setTotalLibros(totalLibros - 1);
                alert("Libro Borrado con éxito");
                setLimpiar(true);
            }
        } catch {
            alert("El libro seleccionado no existe en nuestra Biblioteca");
            setLimpiar(true);
        }
    };

    return (
        <>
            <div className="class-libros">
                <h2>Libros</h2>
                <input id="id-titulo-libros" type="text" placeholder="Titulo" ref={tituloRef} required />
                <input id="id-autor-libros" type="text" placeholder="Autor" ref={autorRef} />
                <input id="id-genero-libros" type="text" placeholder="Genero" ref={generoRef} />
                <input id="id-fecha-libros" type="date" placeholder="fecha-de-publicacion" ref={fechaRef} />
                <input id="id-precio-libros" type="number" placeholder="Precio" ref={precioRef} />
                <input type="submit" value="Guardar Libro" onClick={guardarLibro} />
                <input type="submit" value="Actualizar Libro" onClick={actualizarLibro} />
                <input type="submit" value="Borrar Libro" onClick={borrarLibro} />
            </div>
            <div className="historial-libros">
                <h2>Historial de Libros Registrados</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Género</th>
                            <th>Fecha</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {librosRegistrados.map((libro, index) => (
                            <tr key={index}>
                                <td>{libro.title}</td>
                                <td>{libro.author}</td>
                                <td>{libro.gender}</td>
                                <td>{libro.date}</td>
                                <td>{libro.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Libros;

