<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:D="DAV:" exclude-result-prefixes="D">
<xsl:output method="html" encoding="UTF-8" />

<xsl:template match="D:multistatus">
	<xsl:text disable-output-escaping="yes">&lt;?xml version="1.0" encoding="utf-8" ?&gt;</xsl:text>
	<D:multistatus xmlns:D="DAV:">
		<xsl:copy-of select="*"/>
	</D:multistatus>
</xsl:template>

<xsl:template match="/list">
  <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html&gt;</xsl:text>

  <html>
    <head>
	<link   rel="stylesheet" href="/assets/autoindex.css" />
	<script src="/assets/autoindex.js"></script>
	<script src="https://kit.fontawesome.com/55eb9c16a8.js"></script>
    </head>
    <body>
      <div id="progresswin">
        <progress id="progressbar"></progress>
      </div>
      <div id="droparea">
	      <nav id="breadcrumbs"><ul><li><a href="/"><i class="fa fa-home"></i></a></li></ul></nav>
	      <table id="contents">
	        <tbody>
	            <tr class="directory go-up">
	              <td class="icon"><a href="../"><i class="fa fa-arrow-up"></i></a></td>
	              <td class="name"><a href="../">..</a></td>
	              <td class="size"><a href="../"></a></td>
	              <td class="mtime"><a href="../"></a></td>
                      <td class="actions"><a href="../"></a></td>
	            </tr>
	          <xsl:if test="count(directory) != 0">
	            <tr class="separator directories">
	              <td colspan="4"><hr/></td>
	            </tr>
	          </xsl:if>

	          <xsl:for-each select="directory">
	            <tr class="directory">
	              <td class="icon"><a href="{.}/"><i class="fa fa-folder"></i></a></td>
	              <td class="name"><a href="{.}/"><xsl:value-of select="." /></a></td>
	              <td class="size"><a href="{.}/"></a></td>
	              <td class="mtime"><a href="{.}/"><xsl:value-of select="./@mtime" /></a></td>
		      <td class="actions"><a href="{.}/"></a></td>
	            </tr>
	          </xsl:for-each>

	          <xsl:if test="count(file) != 0">
	            <tr class="separator files">
	              <td colspan="4"><hr/></td>
	            </tr>
	          </xsl:if>

	          <xsl:for-each select="file">
	            <tr class="file">
	              <td class="icon"><a href="{.}" download="{.}"><i class="fa fa-file"></i></a></td>
	              <td class="name"><a href="{.}" download="{.}"><xsl:value-of select="." /></a></td>
	              <td class="size"><a href="{.}" download="{.}"><xsl:value-of select="./@size" /></a></td>
	              <td class="mtime"><a href="{.}" download="{.}"><xsl:value-of select="./@mtime" /></a></td>
                      <td class="actions">
			<ul>
				<li><a href="{.}" data-action="delete" class="fa fa-trash"></a></li>
			</ul>
		      </td>
	            </tr>
	          </xsl:for-each>
	        </tbody>
	      </table>
	</div>
    </body>
  </html>
  </xsl:template>
</xsl:stylesheet>
