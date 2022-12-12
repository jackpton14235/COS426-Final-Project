class SphereCollider {
    // takes two meshes, A and B, a radius for their collisionn sphere, a position
    // offset for the center of their sphere offset from the mesh position, and 
    // a function to call when they collide
    constructor(
        meshA,
        offsetA,
        radiusA,
        meshB,
        offsetB,
        radiusB,
        onCollide,
        deactivateOnCollide
    ) {
        this.meshA = meshA;
        this.offsetA = offsetA;
        this.radiusA = radiusA;
        this.meshB = meshB;
        this.offsetB = offsetB;
        this.radiusB = radiusB;
        this.onCollide = onCollide;
        this.deactivateOnCollide = deactivateOnCollide;
        // preprocess radius squared since it's constant
        this.rad2 = (radiusA + radiusB) * (radiusA + radiusB)
        this.active = true;
    }
    checkCollision() {
        if (!this.active) return;
        const centerA = this.meshA.position.clone().add(this.offsetA);
        const centerB = this.meshB.position.clone().add(this.offsetB);

        const dir = centerA.sub(centerB);
        if (dir.dot(dir) < this.rad2) {
            this.onCollide(this.deactivate);
            if (this.deactivateOnCollide) this.active = false;
        }
    }
}

export default SphereCollider;