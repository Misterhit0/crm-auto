<?php

$files = array(
    '/home/cogepartfr/www/file_upload/edi/calva/sent/DISPOR_20260806161301_H?+4.edi',
    '/home/cogepartfr/www/file_upload/edi/calva/sent/DISPOR_20260806164419_H?+4.edi',
    '/home/cogepartfr/www/file_upload/edi/calva/sent/DISPOR_20260907090101_J1.edi',
    '/home/cogepartfr/www/file_upload/edi/calva/sent/DISPOR_20260907102817_H4.edi',
    '/home/cogepartfr/www/file_upload/edi/calva/sent/DISPOR_20260907102901_H4.edi',
    '/home/cogepartfr/www/file_upload/edi/calva/sent/DISPOR_20260907104737_H4.edi',
    '/home/cogepartfr/www/file_upload/edi/calva/sent/DISPOR_20260907104802_H4.edi',
    '/home/cogepartfr/www/file_upload/edi/calva/sent/DISPOR_20260907113002_H4.edi',
    '/home/cogepartfr/www/file_upload/edi/calva/sent/DISPOR_20260908160401_H4.edi'
);

foreach ($files as $fp) {
    if (!file_exists($fp)) {
        echo "Missing: " . basename($fp) . "\n";
        continue;
    }
    $c = file_get_contents($fp);
    preg_match_all('/DOC\+WBL\+\+\+INF\+([^\'\s]+)/', $c, $m_bords);
    preg_match_all('/GIN\+BN\+([^\'\s]+)/', $c, $m_gins);
    
    $bords = isset($m_bords[1]) ? implode(',', $m_bords[1]) : '';
    $gins = isset($m_gins[1]) ? implode(',', $m_gins[1]) : '';
    
    echo basename($fp) . " | bords=[" . $bords . "] | colis=[" . $gins . "]\n";
}
