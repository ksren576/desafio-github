const request = async (url) => {
  try {
    const baseUrl = "https://api.github.com/users";
    const rawData = await fetch(baseUrl + url);
    return rawData.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUser = async (user) => {
  const url = `/${user}`;
  return request(url);
};

const getRepo = async (user, pagina, cantidadRepos) => {
  const url = `/${user}/repos?page=${pagina}&per_page=${cantidadRepos}`;
  return request(url);
};

const getValue = (value) => !value ? 'Sin información' : value;

const btnEnviar = document.getElementById("btnEnviar");
btnEnviar.addEventListener("click", () => {
  const elementoNombre = document.getElementById("nombre");
  const elementoPagina = document.getElementById("pagina");
  const elementoRepoPagina = document.getElementById("repoPagina");

  const renderInfoUsuario = (datosUsuario) => (
      `<img src="${datosUsuario.avatar_url}" alt="Avatar del usuario" />
      <p>Nombre de usuario: ${getValue(datosUsuario.name)}</p>
      <p>Nombre de login: ${getValue(datosUsuario.login)}</p>
      <p>Cantidad de repositorios: ${getValue(datosUsuario.public_repos)}</p>
      <p>Locación: ${getValue(datosUsuario.location)}</p>
      <p>Tipo de usuario: ${getValue(datosUsuario.type)}</p>`
  )

  const renderRepo = (datosRepo) => (
      `<a href="${datosRepo.html_url}" target="_blank">${datosRepo.name}</a><br />`
  )

  const ejecutarRequests = async () => {
    const elementoResultados = document.getElementById('resultados');
    const elementoDatosUsuario = document.getElementById('datosUsuario');
    const elementoRepos = document.getElementById('repositorios');
    const elementoAlerta = document.getElementById('alerta');

    const result = await Promise.all([
      getUser(elementoNombre.value),
      getRepo(
        elementoNombre.value,
        elementoPagina.value,
        elementoRepoPagina.value
      ),
    ]);

    const resultUser = result[0];
    const resultRepo = result[1];

    if (resultUser.message === 'Not Found') {
      elementoResultados.classList.add('d-none');
      elementoAlerta.classList.remove('d-none');
      return;
    }
    elementoAlerta.classList.add('d-none');

    elementoResultados.classList.remove('d-none');
    elementoDatosUsuario.innerHTML = renderInfoUsuario(resultUser);
    elementoRepos.innerHTML = resultRepo.map((repo) => renderRepo(repo)).join('');
  };

  ejecutarRequests();
});
