export { load_async, load_vehicle, load_brick, load_simple, yieldingLoop, snakecase };

function load_async(array, load_fn, parent_id,
                    template_id = parent_id + '_template', log = parent_id) {
  return new Promise((resolve, reject) => {
    const template = document.getElementById(template_id);
    const parent = document.getElementById(parent_id);
    yieldingLoop(array.length, 32, 256, function (i) {
      load_fn(array[i], [template, parent]); // tried to pass parent as a 3rd param, but for some reason it's undefined?
    }, function () {
      resolve();
    }, log);
  });
}

/*function load_vehicles(vehicles, [template, parent]) {
  for (let i in vehicles) {
    load_vehicle(vehicles[i], template, parent);
  }
}
 
function load_bricks(json, [template, parent]) {
  for (let key in json) {
    load_brick(json[key], template, parent);
  }
}*/

function load_vehicle(data, [template, parent]) {
  let tile = template.cloneNode(true);
  tile.querySelector('#v_name').innerText = data.name;

  let rarity = {
    null: 'rarity0',
    'Cool': 'rarity1',
    'Awesome': 'rarity2',
    'SuperAwesome': 'rarity3'
  }[data.rarity]
  tile.classList.remove('rarity3');
  tile.classList.add(rarity);

  if (data.perk == null) {
    tile.querySelector('#v_perk').style.visibility = 'hidden';
  } else {
    tile.querySelector('#v_perk').src = `icons/vehicle-perks/${snakecase(data.perk)}.png`;
  }

  tile.querySelector('#v_terrain').src = `icons/vehicle-terrain/${snakecase(data.terrain)}.png`;
  tile.querySelector('#v_n_surplus').innerText = data.n_surplus;
  // tile.querySelector('#brick_weight').innerText = data.weight
  //tile.querySelector('#v_image').loading = "lazy";
  //tile.querySelector('#v_image').src = ... + data.img + '.png';
  tile.href = 'vehicle.html?' + data.id;
  parent.append(tile);
  return tile;
}

function load_brick(data, [template, parent]) {
  let tile = template.cloneNode(true);
  tile.querySelector('#brick_name').innerText = data.name;
  tile.querySelector('#brick_id').innerText = '#' + data.id;
  tile.querySelector('#brick_size').innerText = data.size.join('x');
  tile.querySelector('#brick_weight').innerText = data.weight.toPrecision(3) / 1;
  // the division per 1 trim the trailing zeros (and remove the sci notation)
  tile.querySelector('#brick_image').loading = "lazy";
  tile.querySelector('#brick_image').src = !data.no_image ? 'textures/bricks/' + data.id + '.png' : 'textures/woosh.png';
  if (!data.is_surplus) {
    tile.querySelector('#brick_source').style.visibility = "hidden";
  }
  tile.querySelector('#brick_n_usage').innerText = data.n_usage;
  tile.href = 'brick.html?' + data.id;
  parent.append(tile);
  return tile;
}

function load_simple(data, [template, parent],
                     image_path = `textures/${parent.id}/${data.id}.png`) {
  
  let tile = template.cloneNode(true);
  
  tile.querySelector('#name').innerText = data.name;
  
  let rarity = {
    null: 'rarity0',
    'Cool': 'rarity1',
    'Awesome': 'rarity2',
    'SuperAwesome': 'rarity3'
  }[data.rarity]
  tile.classList.remove('rarity3');
  tile.classList.add(rarity);

  tile.querySelector('#image').loading = "lazy";
  console.log(data.have_icon);
  tile.querySelector('#image').src = !data.no_image ? image_path : 'textures/woosh.png';
  
  parent.append(tile);
  return tile;
}


function yieldingLoop(count, firstChunkSize, otherChunkSize, callback, finished, verbose = false) {
  if (verbose) { var t1 = performance.now(); }
  var i = 0;
  var chunksize = firstChunkSize;
  (function chunk() {
    var end = Math.min(i + chunksize, count);
    for (; i < end; ++i) {
      callback.call(null, i);
    }
    if (verbose && i - chunksize == 0) { console.log(`first ${verbose}: ${performance.now() - t1} ms`); }
    if (i < count) {
      chunksize = otherChunkSize;
      setTimeout(chunk, 0);
    } else {
      if (verbose) { console.log(`full ${verbose}: ${performance.now() - t1} ms`); }
      finished.call(null);
    }
  })();
}

function snakecase(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function len(object) {
  return Object.keys(object).length;
}