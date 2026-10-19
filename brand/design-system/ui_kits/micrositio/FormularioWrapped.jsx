function Esperanza() {
  const { CifraProtagonista, CampoLuces } = DS;
  return (
    <section data-screen-label="06 Esperanza" style={{ padding: "56px 20px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
      <CampoLuces total={300} proporcion={0.68} semilla={5} />
      <CifraProtagonista tamano="cifra" valor="15,000" unidad="+" antetitulo="Lo que sigue encendido" etiqueta="secciones donde los jóvenes votan 60% o más. No es un caso perdido: hay lugares donde la luz no se apaga." />
    </section>
  );
}

function FormularioWrapped({ onCrear = () => {}, inicial = {} }) {
  const { SelectorEstadoMunicipio, CampoEdad, SelectorSexo, Boton, Icono } = DS;
  const [f, setF] = React.useState({ estado: undefined, municipio: undefined, edad: "", sexo: undefined, ...inicial });
  const valido = f.estado && f.municipio && f.edad >= 18 && f.edad <= 99;
  return (
    <section data-screen-label="07 Formulario Wrapped" style={{ padding: "40px 20px 48px", display: "flex", flexDirection: "column", gap: 22 }}>
      <span style={{ ...kitAnte, color: "var(--color-acento-texto)" }}>Tus tarjetas</span>
      <h2 style={kitTitulo2}>¿Tu luz sigue encendida?</h2>
      <p style={{ ...kitEntrada, color: "var(--color-texto-2)", fontSize: 17 }}>Con tu municipio y tu edad armamos cinco tarjetas para compartir. No guardamos tus datos.</p>
      <SelectorEstadoMunicipio estados={kitDatos.catalogo} estado={f.estado} municipio={f.municipio} onCambiar={(v) => setF({ ...f, ...v })} />
      <CampoEdad valor={f.edad} onCambiar={(edad) => setF({ ...f, edad })} />
      <SelectorSexo valor={f.sexo} onCambiar={(sexo) => setF({ ...f, sexo })} />
      <Boton completo tamano="lg" disabled={!valido} iconoFinal={<Icono nombre="arrow-right" />} onClick={() => onCrear(f)}>Crear mis tarjetas</Boton>
    </section>
  );
}
Object.assign(window, { Esperanza, FormularioWrapped });
