<?php

$image_size = 20;

$dim = 3;
if ( isset( $_GET['dim'] ) ) $dim = intval( $_GET['dim'] );

$mask = pow( 2, $dim*$dim );
if ( isset( $_GET['mask'] ) ) $mask = intval( $_GET['mask'] );

// 9 bits ~> 512 possible combinations (-9 for the single ones)

$i = imagecreate( $image_size, $image_size );
$transp = imagecolorallocatealpha( $i, 0xff, 0xff, 0xff, 0x7f );

imagefill( $i, 1, 1, $transp );

if ( !isset( $_GET['changed'] ) ) {
    $boxcolor = imagecolorallocate( $i, 0xdd, 0xdd, 0xdd );
} else {
    $boxcolor = imagecolorallocate( $i, 0xff, 0x88, 0x88 );
}
$boxsize  = ($image_size+1) / $dim;

for ( $y=0; $y<$dim; $y++ ) {
    for ( $x=0; $x<$dim; $x++ ) {
        $m = 1 << ( $y*$dim + $x );
        if ( ( $m & $mask ) == $m ) {
            imagefilledrectangle( $i, $x*$boxsize, $y*$boxsize, ($x+1)*$boxsize-2, ($y+1)*$boxsize-2, $boxcolor );
        }
    }
}

header( 'Content-Type: image/png' );
imagepng( $i );
imagedestroy( $i );

?>