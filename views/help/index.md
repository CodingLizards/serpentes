<!--- Please transform with https://stackedit.io/ --->

# Inhalt

[toc]

# Startseite

Auf der Startseite werden die Tickets angezeigt, die dir zugeordnet sind, dadurch hast du einen schnellen Zugriff auf deine Tickets.

<table class="pure-table pure-table-horizontal pure-table-striped pure-table-fullsize">
    <thead>
        <tr>
            <th style="width: 150px">#</th>
            <th style="width: 50px">Priorit&auml;t</th>
            <th>Beschreibung<th>
        </tr>
    </thead>
    <tbody>
            <tr>
	            <td><a href="#">1234567894</a></td>
	            <td>15</td>
	            <td>Irgendwas ist kaputt gegangen, als wir versucht haben...</td>
          </tr>
    </tbody>
</table>

# Ticketverwaltung
Zur Anzeige von Tickets gibt es f&uuml;nf verschiedene Modi. Diese unterscheiden sich wie folgt:

<dl>
	<dt>Aktive Tickets</dt>
	<dd>Hierdrunter fallen alle Tickets, die einen Besitzer haben und nicht im Archiv liegen</dd>
	<dt>Freie Tickets</dt>
	<dd>Hierdrunter fallen alle Tickets, die keinen Besitzer haben, nicht im Archiv liegen aber eine Priorit&auml;t haben</dd>
		<dt>Unpriorisierte Tickets</dt>
	<dd>Hierdrunter fallen alle Tickets, die keine Priorit&auml;t haben und nicht im Archiv liegen</dd>
	<dt>Archivierte Tickets</dt>
	<dd>Hierdrunter fallen alle Tickets, die im Archiv liegen</dd>
</dl>

## Ticketanzeige

Die Ticketanzeige ist eine, immer gleiche, einfache Tabelle.

<table class="pure-table pure-table-horizontal pure-table-striped pure-table-fullsize" id="data" data-sortable="">
    <thead>
        <tr>
            <th style="width: 150px;">#</th>
            <th style="width: 50px;">Priorität</th>
            <th>Beschreibung</th>
            <th>Besitzer</th>
            <th>Zeitlicher Schaden pro Woche (in Minuten)</th>
            <th>Finanzieller Schade pro Auftrag (in €)</th>
            <th>Brandschädigend</th>
            <th>Emergency</th>
            <th>Letzter Kommentar</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><a>1234567</a></td>
            <td contenteditable="true">1</td>
            <td>Es geht eine wichtige Komponente nicht mehr...</td>
            <td>Theo Test</td>
            <td>120</td>
            <td>2000</td>
            <td>
                <i class="fa fa-toggle-on"></i>
            </td>
            <td>
                <i class="fa fa-toggle-on"></i>
            </td>
            <td>
                Ich habe mit der Arbeit angefangen
            <td>
        </tr>        
        <tr>
            <td><a>1234568</a></td>
            <td contenteditable="true">20</td>
            <td>Wir m&ouml;chten bitte einen neuen But...</td>
            <td>Theo Test</td>
            <td>20</td>
            <td>200</td>
            <td>
                <i class="fa fa-toggle-off"></i>
            </td>
            <td>
                <i class="fa fa-toggle-off"></i>
            </td>
            <td>
                Priorität hinzugefügt
             <td>
        </tr>
     </tbody>
</table>

## Ticketdetails

Die Detailseite für Tickets kann über einen Klick auf die ID erreicht werden. Sie bietet einen Überblick über alle Ticketdaten und folgende Funktionen

- Kommentare hinzufügen
- Ticket zuweisen
- Ticket als gereviewed markieren
- Ticket archivieren
- Ticket bearbeiten

### Allgemein

Diese Seite zeigt allgemeine Informationen über das Ticket an. Es dient als Auskunftsseite.

### Impact

Diese Seite zeigt Informationen über den Impact, den das Ticket verursacht an.

### Weitere Details

Auf dieser Seite werden weitere Details, wie die betroffenen Mandanten, Anwendungen und Abteilungen angezeigt.

### Kommentare

Auf dieser Seite sind alle Kommentare des Tickets chronologisch aufgelistet. Es können neue Kommentare hinzugefügt werden, diesen wird automatischer beigefügt, wer den Kommentar erstellt hat und wann.

### Bearbeiterhistorie

Die Bearbeiterhistorie gibt einen Überblick, wann wer das Ticket bearbeitet hat. Dies ist von Nutzen, wenn unklar ist, welcher Mitarbeiter in der QA das Ticket getestet hat.

### Ticket bearbeiten

Hier kann das Ticket bearbeitet werden und weitere Details können hinzugefügt werden.

### Weitere Aktionen

Unter diesem Abschnitt kann das Ticket anderen Mitarbeitern zugewiesen und ins Archiv geschoben werden.

Weiterhin ist es möglich den Reviewstatus auf Gereviewed zu setzen. Dadurch ist sehen andere, dass das Ticket ok ist.
