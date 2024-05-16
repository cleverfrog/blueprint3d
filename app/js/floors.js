$(document).ready(function() {
  var floors = [
    {
      "name": "Light Hardwood",
      "image": "rooms/thumbnails/light_hardwood.jpg",
      "model": "rooms/textures/light_hardwood.jpg",
      "texture_stretch": "false",
      "texture_scale": "300"
    },
    {
      "name": "Medium Hardwood",
      "image": "rooms/thumbnails/medium_hardwood.jpg",
      "model": "rooms/textures/medium_hardwood.jpg",
      "texture_stretch": "false",
      "texture_scale": "300"
    },
    {
      "name": "Dark Concrete",
      "image": "rooms/thumbnails/dark_concrete.jpg",
      "model": "rooms/textures/dark_concrete.jpg",
      "texture_stretch": "false",
      "texture_scale": "150"
    },
    {
      "name": "Brick Pavers",
      "image": "rooms/thumbnails/brick_pavers.jpg",
      "model": "rooms/textures/brick_pavers.jpg",
      "texture_stretch": "false",
      "texture_scale": "150"
    }
  ]

  var floorsDiv = $("#floorTexturesDiv .panel-body");

  for (var i = 0; i < floors.length; i++) {
    var floor = floors[i];
    var html = `<div class="col-sm-6 thumbnail-wrapper"><a href="#" class="thumbnail texture-select-thumbnail" texture-url="${floor.model}" texture-stretch="${floor.texture_stretch}" texture-scale="${floor.texture_scale}"><img alt="${floor.name}" src="${floor.image}" /></a></div>`;
    floorsDiv.append(html);
  }
});
