import { useState, useEffect } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

export default function App() {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">App de Pedidos - Diseñoslowcost</h1>
      {/* Aquí va el contenido de tu app, incluido login, registro, panel, etc. */}
    </div>
  );
}
import { useState, useEffect } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

export default function App() {
  const [vista, setVista] = useState("login");
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: "", email: "", empresa: "", password: "" });
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [editarIndex, setEditarIndex] = useState(null);
  const [editarDatos, setEditarDatos] = useState({ nombre: "", email: "", empresa: "", password: "" });
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    setUsuarios([{ nombre: "Administrador", email: "delas", empresa: "", password: "8797", rol: "admin" }]);
  }, []);

  const registrar = () => {
    if (!form.email || !form.password) return alert("Email y contraseña obligatorios");
    const existe = usuarios.find(u => u.email === form.email);
    if (existe) return alert("Este correo ya está registrado");
    setUsuarios([...usuarios, { ...form, rol: "cliente" }]);
    alert("Registro completado");
    setVista("login");
  };

  const login = () => {
    const user = usuarios.find(u => u.email === form.email && u.password === form.password);
    if (!user) return alert("Credenciales incorrectas");
    setUsuarioActivo(user);
    setVista("panel");
  };

  const logout = () => {
    setUsuarioActivo(null);
    setVista("login");
  };

  const actualizarUsuario = () => {
    const actualizados = [...usuarios];
    actualizados[editarIndex] = { ...actualizados[editarIndex], ...editarDatos };
    setUsuarios(actualizados);
    setEditarIndex(null);
    alert("Usuario actualizado");
  };

  const exportarCSV = () => {
    const encabezado = "Nombre,Email,Empresa,Rol";
    const filas = usuarios.map(u => `${u.nombre},${u.email},${u.empresa},${u.rol}`).join("\n");
    const contenido = `${encabezado}\n${filas}`;
    const blob = new Blob([contenido], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "usuarios.csv";
    a.click();
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Diseñoslowcost · Pedidos</h1>

      {vista === "registro" && (
        <Card>
          <CardContent className="space-y-2 mt-4">
            <h2 className="text-lg font-semibold">Registro</h2>
            <Input placeholder="Nombre" onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <Input placeholder="Empresa" onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
            <Input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Contraseña" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button onClick={registrar}>Registrarse</Button>
            <Button variant="outline" onClick={() => setVista("login")}>Volver al login</Button>
          </CardContent>
        </Card>
      )}

      {vista === "login" && (
        <Card>
          <CardContent className="space-y-2 mt-4">
            <h2 className="text-lg font-semibold">Iniciar sesión</h2>
            <Input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Contraseña" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button onClick={login}>Entrar</Button>
            <Button variant="outline" onClick={() => setVista("registro")}>Registrarse</Button>
          </CardContent>
        </Card>
      )}

      {vista === "panel" && (
        <Card>
          <CardContent className="space-y-2 mt-4">
            <h2 className="text-lg font-semibold">Bienvenido, {usuarioActivo?.nombre}</h2>
            <p className="text-sm">Empresa: {usuarioActivo?.empresa}</p>
            {usuarioActivo?.rol === "admin" && (
              <div className="bg-gray-100 p-2 rounded space-y-2">
                <p className="text-sm font-bold text-blue-600">[Administrador]</p>
                <Input placeholder="Buscar clientes" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                <Button onClick={exportarCSV} className="w-full">Exportar usuarios</Button>
                <h3 className="text-md font-semibold mt-2">Usuarios registrados:</h3>
                <ul className="text-sm list-disc ml-5">
                  {usuarios.filter(u => u.nombre.toLowerCase().includes(busqueda.toLowerCase())).map((u, i) => (
                    <li key={i}>
                      {u.nombre} - {u.email} ({u.rol})
                      {i !== 0 && (
                        <>
                          <Button size="sm" className="ml-2" onClick={() => {
                            setEditarIndex(i);
                            setEditarDatos(u);
                          }}>Editar</Button>
                          <Button size="sm" variant="destructive" className="ml-2" onClick={() => {
                            if (confirm(`¿Eliminar cuenta de ${u.nombre}?`)) {
                              const copia = [...usuarios];
                              copia.splice(i, 1);
                              setUsuarios(copia);
                              alert("Cuenta eliminada");
                            }
                          }}>Eliminar</Button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button className="w-full" onClick={logout} variant="destructive">Cerrar sesión</Button>
          </CardContent>
        </Card>
      )}

      {editarIndex !== null && (
        <Card className="mt-4">
          <CardContent className="space-y-2">
            <h2 className="text-lg font-semibold">Editar usuario</h2>
            <Input value={editarDatos.nombre} onChange={(e) => setEditarDatos({ ...editarDatos, nombre: e.target.value })} />
            <Input value={editarDatos.email} onChange={(e) => setEditarDatos({ ...editarDatos, email: e.target.value })} />
            <Input value={editarDatos.empresa} onChange={(e) => setEditarDatos({ ...editarDatos, empresa: e.target.value })} />
            <Input value={editarDatos.password} onChange={(e) => setEditarDatos({ ...editarDatos, password: e.target.value })} />
            <Button onClick={actualizarUsuario}>Guardar cambios</Button>
            <Button variant="outline" onClick={() => setEditarIndex(null)}>Cancelar</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

