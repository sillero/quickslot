export default (options, actions) =>
`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>${options.title || ''}</title>
    <link rel="stylesheet" href="${options.stylesheetURL || './lib/html/stylesheet.css'}">
  </head>
  <body>
    <main>
      <div class="handle drag-area"></div>
      <form name="actions" class="actions">
        ${actions.map(action =>
          `<button name="${action.name}" onClick="run('${action.name}'); return false;">${action.name}</button>`
        ).join('')}
      </form>
    </main>
  </body>

  <script>
    actions = ${JSON.stringify(actions)}
    require('${options.entryRenderer || './lib/entryRenderer'}')
  </script>
</html>
`