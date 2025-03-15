export default {
  addSlab: <><h3>Add a slab</h3><p>Adds a slab to the existing layout.</p></>,
  addDuplicate: <><h3>Duplicate layout</h3><p>Duplicates the existing layout a set number of times, applying modifiers to each copy.</p><p><i style={{ color: "#dff" }}>You can use variable <b style={{ color: "#f55" }}>iter</b> which is the number of the current iteration.</i></p></>,
  addOffset: <><h3>Offset layout</h3><p>Offsets the existing layout by the specified amount. Keep in mind that the end result is always normalized to have only positive position values.</p></>,
  addRotate: <><h3>Rotate layout</h3><p>Rotates the existing layout by the specified amount.</p></>,
  addScale: <><h3>Scale layout</h3><p>Scales <strong>the relative positions of</strong> the objects. The objects themselves cannot be scaled.</p></>,
  addReplace: <><h3>Replace assets</h3><p>Replaces the specified assets with a different asset or a slab.</p></>,
  addFilter: <><h3>Filter assets</h3><p>Filters the specified assets and either deletes them or applies the sub-modifiers to them.</p></>,
  addGroup: <><h3>Group block</h3><p>Creates an empty group block to help with organising the layout edits.</p></>,

  duplicate_count: <><h3>Duplicates count</h3><p>Amount of times the layout above is duplicated.</p></>,
  duplicate_modifiers: "",
  duplicate_modifiersRelativeOption: <><h3>Relative</h3><p>Applies the sub-modifiers relative to the previous iteration.</p><p><i style={{ color: "#dff" }}>For example, if used with the Rotate modifier set to <b style={{ color: "#f55" }}>15</b> degrees, it will rotate the first duplicate by <b>15</b> degrees, second one by <b>30</b> degrees, and so on.</i></p></>,
  duplicate_modifiersAbsoluteOption: <><h3>Absolute</h3><p>Every copy will be modified exactly the same way by the sub-modifiers.</p><p><i style={{ color: "#dff" }}>For example, if used with the Rotate modifier set to <b style={{ color: "#f55" }}>15</b> degrees, it will rotate every duplicated object by <b>15</b> degrees.</i></p></>,

  filter_fraction: <><h3>Filter fraction</h3><p>Chance for every object matching the UUID below to be affected.</p><p><i style={{ color: "#dff" }}>Can be specified as a fraction between <b>0</b> and <b>1</b> or percentage value with % symbol.</i></p></>,
  filter_uuid: <>If not empty, selects only objects with the specified UUID.</>,
  filter_minDistance: <><h3>Minimum distance</h3>If above zero, selects only objects closer to each other than the given value.</>,
  filter_deleteSelected: <><h3>Delete selected</h3><p>Deletes selected objects.</p><p><i style={{ color: "#dff" }}>The objects will be deleted.</i></p></>,

  offset_x: <><h3>Offset X</h3><p>Offsets the object by specified value in horizontal axis (left or right).</p></>,
  offset_y: <><h3>Offset Y</h3><p>Offsets the object by specified value in vertical axis (up or down).</p></>,
  offset_z: <><h3>Offset Z</h3><p>Offsets the object by specified value in depth axis (forward or backward).</p></>,
  offset_isRandom: <><h3>Random offset</h3><p>If selected, the offset will be randomised by value between the specified offset in the given axis and it's negative value.</p><p><i style={{ color: "#dff" }}>For example if given offset <b style={{ color: "#f55" }}>1</b> it will randomise between <b>-1</b> and <b>1</b></i></p></>,

  replace_from: "",
  replace_fromAllOption: <>Replace all objects.</>,
  replace_fromUuidOption: <>Replace objects with a specified UUID.</>,
  replace_fromUuid: <><p>Specify the UUID of the object you want to replace.</p><p><i style={{ color: "#dff" }}>You can use the Eyedropper Tool on the right as well.</i></p></>,
  replace_to: "",
  replace_toUuidOption: <>Change to an object with the specified UUID.</>,
  replace_toSlabOption: <>Change to a specified slab.</>,
  replace_toUuid: <><p>Specify the UUID of the replacing object.</p><p><i style={{ color: "#dff" }}>You can use the Eyedropper Tool on the right as well.</i></p></>,
  replace_toSlab: <>Paste the slab you wish to change the objects to.</>,

  rotate_axis: <><h3>Rotate axis</h3><p>Select the axis around which to rotate the objects.</p><p><i style={{ color: "#dff" }}>Elements will be rotated around their own axis only if <b style={{ color: "#f55" }}>Y</b> axis is selected.</i></p></>,
  rotate_axisXOption: "",
  rotate_axisYOption: "",
  rotate_axisZOption: "",
  rotate_center: "",
  rotate_centerZeroOption: <><p>Rotate the slab around the current slab origin <b style={{ color: "#f55" }}><i>(magic)</i></b>.</p> <p><i style={{ color: "#dff" }}>Rotates around the coordinate of the bottom left most object in the current layout.</i></p></>,
  rotate_centerCenterOption: <>Rotate the slab around the center of the bounding box.</>,
  rotate_type: "",
  rotate_typeDegreeOption: <><h3>Degree</h3>Rotate by specified amount of degrees.</>,
  rotate_typeVariationOption: <><h3>Variation</h3><p>Input a list of values, from which the tool will randomly select one option to rotate each object by.</p><p><i style={{ color: "#dff" }}>For example if given option <b style={{ color: "#f55" }}>15 30 45</b> it will select one of the values and rotate the object by either <b>15</b>, <b>30</b>, or <b>45</b> degrees.</i></p></>,
  rotate_typeRandomOption: <><h3>Random</h3>Rotate by a random amount of degrees between two specified values.</>,
  rotate_rotation: <>Set degrees to rotate by.</>,
  rotate_rotationVariations: <><p>Specify a list of variations to rotate by.</p><p><i>Recognised separators: <b style={{ color: "#f55" }}>&nbsp;&nbsp;space &nbsp;&nbsp;&nbsp;, &nbsp;&nbsp;&nbsp;;</b></i></p></>,
  rotate_rotationFrom: <>Set minimum rotation.</>,
  rotate_rotationTo: <>Set maximum rotation.</>,
  rotate_elementsOnly: <><h3>Elements only</h3><p>If selected, all the objects (prop or tile) in the layout above will only rotate around their own center without rotating the entire slab.</p></>,
  rotate_offset_x: <><h3>Axis offset X</h3><p>Offsets the axis of rotation by specified value in horizontal direction (left or right).</p><p><i style={{ color: "#dff" }}>You can treat it as a radius of the rotation.</i></p></>,
  rotate_offset_y: <><h3>Axis offset Y</h3><p>Offsets the axis of rotation by specified value in vertical direction (up or down).</p><p><i style={{ color: "#dff" }}>You can treat it as a radius of the rotation.</i></p></>,
  rotate_offset_z: <><h3>Axis offset Z</h3><p>Offsets the axis of rotation by specified value in depth direction (forward or backward).</p><p><i style={{ color: "#dff" }}>You can treat it as a radius of the rotation.</i></p></>,

  scale_center: "",
  scale_centerZeroOption: <><p>Transforms the slab around the current slab origin <b style={{ color: "#f55" }}><i>(magic)</i></b>.</p> <p><i style={{ color: "#dff" }}>Transforms around the coordinate of the bottom left most object in the current layout.</i></p></>,
  scale_centerCenterOption: <>Transforms the slab around the center of the bounding box.</>,
  scale_scale_x: <><h3>Scale X</h3><p>Scale the layout by specified value in horizontal axis (left or right).</p><p><i style={{ color: "#dff" }}>Only the positions of the objects inside the layout will be affected.</i></p></>,
  scale_scale_y: <><h3>Scale Y</h3><p>Scale the layout by specified value in vertical axis (up or down).</p><p><i style={{ color: "#dff" }}>Only the positions of the objects inside the layout will be affected.</i></p></>,
  scale_scale_z: <><h3>Scale Z</h3><p>Scale the layout by specified value in depth axis (forward or backward).</p><p><i style={{ color: "#dff" }}>Only the positions of the objects inside the layout will be affected.</i></p></>,
  scale_offset_x: <><h3>Axis offset X</h3><p>Offsets the center of transformation by specified value in horizontal direction (left or right).</p></>,
  scale_offset_y: <><h3>Axis offset Y</h3><p>Offsets the center of transformation by specified value in vertical direction (up or down).</p></>,
  scale_offset_z: <><h3>Axis offset Z</h3><p>Offsets the center of transformation by specified value in depth direction (forward or backward).</p></>,

  slab_json: <><p>Breakdown of the Base64 code on the left for easier visualisation of all components.</p><p>Can be edited directly in the field to change object UUID, it's position and rotation.</p><p><i><b style={{ color: "#f55" }}>Needs to have a mostly correct json structure.</b></i></p></>,
  slab_base64: <><p>Base64 code that Talespire uses for it's building blocks.</p><p>You can copy from and paste to this field directly.</p></>,
  slab_copyButton: <><p>Place the slab from the field below in your hand. It will also be copied to clipboard so you can paste it later on if you wish.</p><p><i><b style={{ color: "#f55" }}>It will clear any other things that have been copied or cut previously.</b></i></p></>,
  slab_eyedropperButton: <><h3>Eyedropper Tool</h3><p>Select the object (prop or tile) in Talespire to automatically get the UUID of the object in the field below.</p><p><i>Only works if used in a Symbiote version of the tool inside Talespire.</i></p><p><i><b style={{ color: "#f55" }}>It will break if a mini is selected.</b></i></p></>,

  copyButton: <><p>Place the entire layout in your hand. It will also be copied to clipboard so you can paste it later on if you wish.</p><p><i><b style={{ color: "#f55" }}>It will clear any other things that have been copied or cut previously.</b></i></p></>,
};
