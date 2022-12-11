const oceanFloorShader = `
#include <common>

uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    vec4 tex = texture2D(iChannel0, uv / .01);
    fragColor = tex;
}

varying vec2 vUv;
void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
}
`

export default oceanFloorShader;