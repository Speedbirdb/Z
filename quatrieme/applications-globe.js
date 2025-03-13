document.addEventListener('DOMContentLoaded', function() {
    // Modify camera settings for applications page
    camera.position.set(
        1,
        Math.sin(Math.PI / 3) * 10,
        Math.cos(Math.PI / 3) * 10
    );
    
    camera.lookAt(new THREE.Vector3(11, -8, -8));
    camera.fov = 25;
    camera.updateProjectionMatrix();
});
