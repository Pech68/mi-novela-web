// Importamos el cliente de Supabase
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  // Obtenemos las llaves secretas que guardamos en Netlify
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  // Creamos el cliente de Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Obtenemos los datos que nos enviará el navegador (el id del usuario y la novela)
  const { user_id, novel_slug } = JSON.parse(event.body);

  // Le pedimos a Supabase que inserte una nueva fila en nuestra tabla "bibliotecas"
  const { data, error } = await supabase
    .from('bibliotecas')
    .insert([
      { user_id: user_id, novel_slug: novel_slug }
    ]);

  if (error) {
    // Si hay un error, lo devolvemos para saber qué pasó
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }

  // Si todo sale bien, devolvemos un mensaje de éxito
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "¡Novela añadida a la biblioteca!" })
  };
};
